from fastapi import APIRouter, HTTPException

from models import APIResponse
from services.categories_service import categories_service

router = APIRouter()

@router.get("", response_model=APIResponse)
async def get_categories():
    """
    Get all unique categories from the product catalog
    """
    try:
        categories = await categories_service.get_categories()
        return APIResponse(success=True, data=categories)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
