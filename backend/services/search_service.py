from google.cloud.retail_v2 import SearchServiceClient, CompletionServiceClient
from google.cloud.retail_v2.types import SearchRequest, CompleteQueryRequest
from config import SEARCH_PLACEMENT, CATALOG_PATH
import uuid

search_client = SearchServiceClient()
completion_client = CompletionServiceClient()

async def search_products(query: str, page_size: int = 20, visitor_id: str = None):
    request = SearchRequest(
        placement=SEARCH_PLACEMENT,
        visitor_id=visitor_id or f"visitor_{uuid.uuid4().hex[:16]}",
        query=query,
        page_size=page_size
    )
    
    response = search_client.search(request)
    
    return {
        "results": [
            {
                "id": r.product.id,
                "title": r.product.title,
                "price": r.product.price_info.price if r.product.price_info else 0,
                "image": r.product.images[0].uri if r.product.images else "",
                "categories": list(r.product.categories)
            }
            for r in response.results
        ],
        "total": response.total_size
    }

async def autocomplete_search(query: str, visitor_id: str = None):
    request = CompleteQueryRequest(
        catalog=CATALOG_PATH,
        query=query,
        visitor_id=visitor_id or f"visitor_{uuid.uuid4().hex[:16]}",
        max_suggestions=5
    )
    
    response = completion_client.complete_query(request)
    
    return {
        "suggestions": [r.suggestion for r in response.completion_results]
    }
