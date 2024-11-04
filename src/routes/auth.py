from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
import requests
import jwt
import bcrypt
import databutton as db
from datetime import datetime, timedelta

router = APIRouter()

# Get JWT secret from environment variables
JWT_SECRET = db.secrets.get("JWT_SECRET") or "your-secret-key"  # Fallback for development

class User(BaseModel):
    email: EmailStr
    hashed_password: str
    name: str
    company: Optional[str] = None
    openai_api_key: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    company: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GithubLogin(BaseModel):
    code: str

class UserResponse(BaseModel):
    email: EmailStr
    name: str
    company: Optional[str] = None
    token: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    openai_api_key: Optional[str] = None

def get_user_by_email(email: str) -> Optional[User]:
    """Get user from storage by email"""
    try:
        users = db.storage.json.get("users", default={})
        user_data = users.get(email)
        if user_data:
            # Convert ISO format strings back to datetime objects
            user_data["created_at"] = datetime.fromisoformat(user_data["created_at"])
            user_data["updated_at"] = datetime.fromisoformat(user_data["updated_at"])
            return User(**user_data)
        return None
    except Exception as err:
        print(f"Error getting user: {str(err)}")
        return None

def save_user(user: User):
    """Save user to storage"""
    try:
        users = db.storage.json.get("users", default={})
        # Convert datetime objects to ISO format strings for JSON serialization
        user_dict = user.dict()
        user_dict["created_at"] = user_dict["created_at"].isoformat()
        user_dict["updated_at"] = user_dict["updated_at"].isoformat()
        users[user.email] = user_dict
        db.storage.json.put("users", users)
    except Exception as err:
        print(f"Error saving user: {str(err)}")
        raise HTTPException(status_code=500, detail="Failed to save user") from err

def create_token(email: str) -> str:
    """Create JWT token for user"""
    expiration = datetime.utcnow() + timedelta(days=7)
    return jwt.encode(
        {"email": email, "exp": expiration},
        JWT_SECRET,
        algorithm="HS256"
    )

def verify_token(token: str) -> str:
    """Verify JWT token and return user email"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload["email"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(token: str) -> User:
    """Get current user from token"""
    email = verify_token(token)
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/register")
def register(user_data: UserCreate) -> UserResponse:
    """Register a new user"""
    if get_user_by_email(user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = bcrypt.hashpw(user_data.password.encode(), bcrypt.gensalt())
    
    # Create user
    now = datetime.utcnow()
    user = User(
        email=user_data.email,
        hashed_password=hashed_password.decode(),
        name=user_data.name,
        company=user_data.company,
        created_at=now,
        updated_at=now
    )
    
    # Save user
    save_user(user)
    
    # Create token
    token = create_token(user.email)
    
    return UserResponse(
        email=user.email,
        name=user.name,
        company=user.company,
        token=token
    )

@router.post("/login")
def login(credentials: UserLogin) -> UserResponse:
    """Login user with email and password"""
    user = get_user_by_email(credentials.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not bcrypt.checkpw(credentials.password.encode(), user.hashed_password.encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    token = create_token(user.email)
    
    return UserResponse(
        email=user.email,
        name=user.name,
        company=user.company,
        token=token
    )

@router.post("/github/login")
def github_login(credentials: GithubLogin) -> UserResponse:
    """Login or register user with GitHub"""
    try:
        # Exchange code for access token
        response = requests.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            data={
                "client_id": db.secrets.get("GITHUB_CLIENT_ID"),
                "client_secret": db.secrets.get("GITHUB_CLIENT_SECRET"),
                "code": credentials.code,
            },
        )
        response.raise_for_status()
        access_token = response.json()["access_token"]

        # Get user info from GitHub
        response = requests.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            },
        )
        response.raise_for_status()
        github_user = response.json()

        # Get user's email
        response = requests.get(
            "https://api.github.com/user/emails",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json",
            },
        )
        response.raise_for_status()
        github_emails = response.json()
        primary_email = next(email["email"] for email in github_emails if email["primary"])

        # Check if user exists
        user = get_user_by_email(primary_email)
        if not user:
            # Create new user
            now = datetime.utcnow()
            user = User(
                email=primary_email,
                hashed_password="",  # No password for GitHub users
                name=github_user["name"] or github_user["login"],
                company=github_user["company"],
                created_at=now,
                updated_at=now
            )
            save_user(user)

        # Create token
        token = create_token(user.email)

        return UserResponse(
            email=user.email,
            name=user.name,
            company=user.company,
            token=token
        )
    except requests.RequestException as e:
        print(f"GitHub API request error: {str(e)}")
        raise HTTPException(status_code=401, detail="Failed to connect to GitHub") from e
    except KeyError as e:
        print(f"GitHub response parsing error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid response from GitHub") from e
    except Exception as e:
        print(f"GitHub login error: {str(e)}")
        raise HTTPException(status_code=401, detail="GitHub authentication failed") from e

@router.get("/me")
def get_me(token: str) -> UserResponse:
    """Get current user"""
    user = get_current_user(token)
    return UserResponse(
        email=user.email,
        name=user.name,
        company=user.company,
        token=""  # Token not needed for this response
    )

@router.put("/me")
def update_me(token: str, update_data: UserUpdate) -> UserResponse:
    """Update current user"""
    user = get_current_user(token)
    # Update user fields
    if update_data.name:
        user.name = update_data.name
    if update_data.company:
        user.company = update_data.company
    if update_data.openai_api_key:
        user.openai_api_key = update_data.openai_api_key
    
    user.updated_at = datetime.utcnow()
    
    # Save updated user
    save_user(user)
    
    return UserResponse(
        email=user.email,
        name=user.name,
        company=user.company,
        token=""  # Token not needed for this response
    )
