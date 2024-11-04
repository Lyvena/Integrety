from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import databutton as db

router = APIRouter()

class DeployRequest(BaseModel):
    site_name: str
    provider: str  # 'netlify' or 'vercel'
    project_id: str
    api_key: str

class DeployResponse(BaseModel):
    success: bool
    message: str
    url: str | None = None

@router.post("/deploy")
def deploy(request: DeployRequest) -> DeployResponse:
    try:
        # Get project data
        projects = db.storage.json.get(f"projects_{request.project_id}", default=[])
        project = next((p for p in projects if p["id"] == request.project_id), None)
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if request.provider == "netlify":
            # Deploy to Netlify
            headers = {
                "Authorization": f"Bearer {request.api_key}",
                "Content-Type": "application/json"
            }
            
            # Create new site if it doesn't exist
            site_data = {
                "name": request.site_name,
                "custom_domain": f"{request.site_name}.netlify.app"
            }
            
            response = requests.post(
                "https://api.netlify.com/api/v1/sites",
                headers=headers,
                json=site_data
            )
            
            if response.status_code not in [200, 201]:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to create Netlify site: {response.text}"
                )
                
            site_id = response.json()["id"]
            site_url = response.json()["url"]
            
            # Deploy the project
            deploy_data = {
                "files": project["files"],
                "draft": False
            }
            
            response = requests.post(
                f"https://api.netlify.com/api/v1/sites/{site_id}/deploys",
                headers=headers,
                json=deploy_data
            )
            
            if response.status_code not in [200, 201]:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to deploy to Netlify: {response.text}"
                )
            
            return DeployResponse(
                success=True,
                message="Successfully deployed to Netlify",
                url=site_url
            )
            
        elif request.provider == "vercel":
            # Deploy to Vercel
            headers = {
                "Authorization": f"Bearer {request.api_key}",
                "Content-Type": "application/json"
            }
            
            # Create new deployment
            deploy_data = {
                "name": request.site_name,
                "files": project["files"],
                "projectSettings": {
                    "framework": None,  # Auto-detect
                    "buildCommand": None,  # Auto-detect
                }
            }
            
            response = requests.post(
                "https://api.vercel.com/v12/deployments",
                headers=headers,
                json=deploy_data
            )
            
            if response.status_code not in [200, 201]:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to deploy to Vercel: {response.text}"
                )
            
            deployment = response.json()
            
            return DeployResponse(
                success=True,
                message="Successfully deployed to Vercel",
                url=deployment["url"]
            )
        
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported provider: {request.provider}"
            )
            
    except Exception as e:
        print(f"Error deploying project: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
