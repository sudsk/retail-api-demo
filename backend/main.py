from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os

from services.search_service import search_products, autocomplete_search
from services.recommendations_service import get_recommendations

app = FastAPI(title="Retail API Demo - Minimal")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class SearchRequest(BaseModel):
    query: str
    page_size: int = 20
    visitor_id: Optional[str] = None

class RecommendationsRequest(BaseModel):
    model: str
    product_id: Optional[str] = None
    visitor_id: Optional[str] = None
    page_size: int = 6

# Routes
@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/api/search")
async def search(req: SearchRequest):
    try:
        results = await search_products(
            query=req.query,
            page_size=req.page_size,
            visitor_id=req.visitor_id
        )
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/search/autocomplete")
async def autocomplete(query: str, visitor_id: Optional[str] = None):
    try:
        results = await autocomplete_search(query, visitor_id)
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recommendations")
async def recommendations(req: RecommendationsRequest):
    try:
        results = await get_recommendations(
            model=req.model,
            product_id=req.product_id,
            visitor_id=req.visitor_id,
            page_size=req.page_size
        )
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/product/{product_id}")
async def get_product(product_id: str):
    # Simplified - fetch from search results
    results = await search_products(query=product_id, page_size=1)
    if results and results.get('results'):
        return {"success": True, "data": results['results'][0]}
    raise HTTPException(status_code=404, detail="Product not found")
