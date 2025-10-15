from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Search Models
class SearchRequest(BaseModel):
    query: str = ""
    visitor_id: Optional[str] = None
    page_size: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)
    filter: str = ""
    order_by: str = ""
    facet_specs: Optional[List[Dict[str, Any]]] = None

class AutocompleteRequest(BaseModel):
    query: str
    visitor_id: Optional[str] = None
    max_suggestions: int = Field(default=5, ge=1, le=20)

# Recommendations Models
class RecommendationsRequest(BaseModel):
    model: str
    visitor_id: Optional[str] = None
    product_id: Optional[str] = None
    page_size: int = Field(default=10, ge=1, le=50)
    filter: str = ""
    params: Optional[Dict[str, Any]] = None

# Products Models
class ProductListRequest(BaseModel):
    page_size: int = Field(default=20, ge=1, le=100)
    page_token: str = ""
    filter: str = ""

# Response Models
class APIResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
