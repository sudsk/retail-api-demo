from fastapi import APIRouter, HTTPException

from models import RecommendationsRequest, APIResponse
from services.recommendations_service import recommendations_service

router = APIRouter()

@router.post("", response_model=APIResponse)
async def get_recommendations(request: RecommendationsRequest):
    """
    Get product recommendations
    """
    try:
        results = await recommendations_service.get_recommendations(
            model=request.model,
            visitor_id=request.visitor_id,
            product_id=request.product_id,
            page_size=request.page_size,
            filter=request.filter,
            params=request.params
        )
        
        return APIResponse(success=True, data=results)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models", response_model=APIResponse)
async def get_models():
    """
    Get available recommendation models
    """
    try:
        models = recommendations_service.get_available_models()
        return APIResponse(success=True, data=models)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
