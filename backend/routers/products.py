from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from models import APIResponse
from services.products_service import products_service

router = APIRouter()

@router.get("/{product_id}", response_model=APIResponse)
async def get_product(product_id: str):
    """
    Get a single product by ID
    """
    try:
        product = await products_service.get_product(product_id)
        return APIResponse(success=True, data=product)
    
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Product not found: {str(e)}")

@router.get("", response_model=APIResponse)
async def list_products(
    page_size: int = Query(20, ge=1, le=100),
    page_token: str = Query(""),
    filter: str = Query("")
):
    """
    List products with optional filtering
    """
    try:
        results = await products_service.list_products(
            page_size=page_size,
            page_token=page_token,
            filter=filter
        )
        
        return APIResponse(success=True, data=results)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
