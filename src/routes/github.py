from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import requests
import databutton as db
from typing import Optional

router = APIRouter()

class GitHubRepo(BaseModel):
    url: str
    fork: bool = False
    github_token: str

class GitHubResponse(BaseModel):
    success: bool
    message: str
    repo_url: Optional[str] = None

def parse_github_url(url: str) -> tuple[str, str]:
    """Parse GitHub URL to get owner and repo name"""
    try:
        parts = url.strip("/").split("/")
        if "github.com" not in parts:
            raise ValueError("Not a valid GitHub URL")
        owner_idx = parts.index("github.com") + 1
        return parts[owner_idx], parts[owner_idx + 1]
    except (IndexError, ValueError) as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

@router.post("/import-github", response_model=GitHubResponse)
def import_github_repo(repo: GitHubRepo) -> GitHubResponse:
    """Import or fork a GitHub repository"""
    try:
        # Get GitHub token from request headers
        github_token = repo.github_token
        if not github_token:
            raise HTTPException(
                status_code=401,
                detail="GitHub token not configured. Please add your GitHub token in settings."
            )

        headers = {"Authorization": f"token {github_token}"}
        owner, repo_name = parse_github_url(repo.url)
        
        # Get repository information
        api_url = f"https://api.github.com/repos/{owner}/{repo_name}"
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        
        if repo.fork:
            # Fork the repository
            fork_url = f"{api_url}/forks"
            response = requests.post(fork_url, headers=headers)
            response.raise_for_status()
            forked_repo = response.json()
            
            return GitHubResponse(
                success=True,
                message="Repository forked successfully",
                repo_url=forked_repo["html_url"]
            )
        else:
            # Just return the repository URL for import
            return GitHubResponse(
                success=True,
                message="Repository ready for import",
                repo_url=repo.url
            )
            
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
