from google.cloud.retail_v2 import SearchServiceClient, CompletionServiceClient
from google.cloud.retail_v2.types import SearchRequest, CompleteQueryRequest
from typing import Dict, Any, List
import uuid

from config import settings

class RetailSearchService:
    def __init__(self):
        self.search_client = SearchServiceClient()
        self.completion_client = CompletionServiceClient()
    
    async def search(
        self,
        query: str = "",
        visitor_id: str = None,
        page_size: int = 20,
        offset: int = 0,
        filter: str = "",
        order_by: str = "",
        facet_specs: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute a search query"""
        
        placement = settings.get_placement_path(settings.RETAIL_SEARCH_PLACEMENT)
        
        # Build facet specs
        if not facet_specs:
            facet_specs = self._get_default_facet_specs()
        
        # Build request
        request = SearchRequest(
            placement=placement,
            visitor_id=visitor_id or self._generate_visitor_id(),
            query=query,
            page_size=page_size,
            offset=offset,
            filter=filter,
            order_by=order_by,
            facet_specs=facet_specs
        )
        
        try:
            response = self.search_client.search(request)
            
            # Convert response to dict
            results = []
            for result in response.results:
                results.append({
                    "id": result.id,
                    "product": self._convert_product_to_dict(result.product)
                })
            
            facets = []
            for facet in response.facets:
                facets.append({
                    "key": facet.key,
                    "values": [
                        {
                            "value": fv.value,
                            "count": fv.count
                        }
                        for fv in facet.values
                    ]
                })
            
            return {
                "results": results,
                "total_size": response.total_size,
                "facets": facets,
                "attribution_token": response.attribution_token,
                "next_page_token": response.next_page_token,
                "corrected_query": response.corrected_query
            }
        
        except Exception as e:
            print(f"Search error: {e}")
            raise
    
    async def autocomplete(
        self,
        query: str,
        visitor_id: str = None,
        max_suggestions: int = 5
    ) -> Dict[str, Any]:
        """Get autocomplete suggestions"""
        
        catalog = settings.catalog_path
        
        request = CompleteQueryRequest(
            catalog=catalog,
            query=query,
            visitor_id=visitor_id or self._generate_visitor_id(),
            max_suggestions=max_suggestions
        )
        
        try:
            response = self.completion_client.complete_query(request)
            
            suggestions = []
            for result in response.completion_results:
                suggestions.append({
                    "suggestion": result.suggestion,
                    "attributes": dict(result.attributes) if result.attributes else {}
                })
            
            return {
                "suggestions": suggestions,
                "attribution_token": response.attribution_token
            }
        
        except Exception as e:
            print(f"Autocomplete error: {e}")
            raise
    
    def _get_default_facet_specs(self) -> List[Dict[str, Any]]:
        """Get default facet specifications"""
        return [
            {
                "facet_key": {
                    "key": "categories"
                },
                "limit": 20
            },
            {
                "facet_key": {
                    "key": "brands"
                },
                "limit": 20
            },
            {
                "facet_key": {
                    "key": "priceInfo.price",
                    "intervals": [
                        {"minimum": 0, "maximum": 25},
                        {"minimum": 25, "maximum": 50},
                        {"minimum": 50, "maximum": 100},
                        {"minimum": 100, "maximum": 250},
                        {"minimum": 250}
                    ]
                }
            }
        ]
    
    def _generate_visitor_id(self) -> str:
        """Generate a visitor ID"""
        return f"visitor_{uuid.uuid4().hex[:16]}"
    
    def _convert_product_to_dict(self, product) -> Dict[str, Any]:
            """Convert Product protobuf to dict"""
            # Extract price info (API uses priceInfo, not price_info)
            price_info = None
            if hasattr(product, 'priceInfo') and product.priceInfo:
                pi = product.priceInfo
                price_info = {
                    "currency_code": pi.currencyCode if hasattr(pi, 'currencyCode') else 'USD',
                    "price": float(pi.price) if hasattr(pi, 'price') else 0.0,
                    "original_price": float(pi.originalPrice) if hasattr(pi, 'originalPrice') else None,
                    "cost": float(pi.cost) if hasattr(pi, 'cost') else None
                }
            elif hasattr(product, 'price_info') and product.price_info:
                # Fallback for snake_case
                pi = product.price_info
                price_info = {
                    "currency_code": pi.currency_code if hasattr(pi, 'currency_code') else 'USD',
                    "price": float(pi.price) if hasattr(pi, 'price') else 0.0,
                    "original_price": float(pi.original_price) if hasattr(pi, 'original_price') else None,
                    "cost": float(pi.cost) if hasattr(pi, 'cost') else None
                }
            
            # Extract images
            images = []
            if hasattr(product, 'images') and product.images:
                for img in product.images:
                    images.append({
                        "uri": img.uri if hasattr(img, 'uri') else '',
                        "height": img.height if hasattr(img, 'height') else 0,
                        "width": img.width if hasattr(img, 'width') else 0
                    })
            
            # Extract attributes
            attributes = {}
            if hasattr(product, 'attributes') and product.attributes:
                for key, value in product.attributes.items():
                    if hasattr(value, 'text') and value.text:
                        attributes[key] = list(value.text)
                    elif hasattr(value, 'numbers') and value.numbers:
                        attributes[key] = list(value.numbers)
            
            return {
                "id": product.id if hasattr(product, 'id') else '',
                "name": product.name if hasattr(product, 'name') else '',
                "title": product.title if hasattr(product, 'title') else 'Untitled Product',
                "description": product.description if hasattr(product, 'description') else '',
                "categories": list(product.categories) if hasattr(product, 'categories') else [],
                "brands": list(product.brands) if hasattr(product, 'brands') else [],
                "price_info": price_info,
                "availability": product.availability if hasattr(product, 'availability') else 'UNKNOWN',
                "uri": product.uri if hasattr(product, 'uri') else '',
                "images": images,
                "attributes": attributes
            }

# Singleton instance
retail_search_service = RetailSearchService()
