from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from models import SearchRequest, AutocompleteRequest, APIResponse
from services.retail_search_service import retail_search_service

router = APIRouter()

@router.post("", response_model=APIResponse)
async def search(request: SearchRequest):
    """
    Execute a search query
    """
    try:
        results = await retail_search_service.search(
            query=request.query,
            visitor_id=request.visitor_id,
            page_size=request.page_size,
            offset=request.offset,
            filter=request.filter,
            order_by=request.order_by,
            facet_specs=request.facet_specs
        )
        
        return APIResponse(success=True, data=results)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/autocomplete", response_model=APIResponse)
async def autocomplete(
    query: str = Query(..., description="Search query"),
    visitor_id: Optional[str] = Query(None, description="Visitor ID"),
    max_suggestions: int = Query(5, ge=1, le=20, description="Maximum suggestions")
):
    """
    Get autocomplete suggestions
    """
    try:
        results = await retail_search_service.autocomplete(
            query=query,
            visitor_id=visitor_id,
            max_suggestions=max_suggestions
        )
        
        return APIResponse(success=True, data=results)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
