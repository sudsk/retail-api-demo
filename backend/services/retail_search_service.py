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
        
        print(f"\n🔍 SEARCH REQUEST:")
        print(f"   Query: '{query}'")
        print(f"   Filter: '{filter}'")
        print(f"   Page size: {page_size}, Offset: {offset}")
        print(f"   Placement: {placement}")
        
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
            
            print(f"✅ SEARCH RESPONSE:")
            print(f"   Total products: {response.total_size}")
            print(f"   Results returned: {len(list(response.results))}")
            
            # Convert response to dict
            results = []
            for idx, result in enumerate(response.results):
                product_dict = self._convert_product_to_dict(result.product)
                
                if idx < 3:  # Log first 3 products
                    print(f"   Product {idx + 1}:")
                    print(f"      ID: {product_dict.get('id')}")
                    print(f"      Title: {product_dict.get('title')}")
                    print(f"      Price Info: {product_dict.get('price_info')}")
                
                results.append({
                    "id": result.id,
                    "product": product_dict
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
            print(f"\n❌ SEARCH ERROR: {e}")
            print(f"   Error type: {type(e).__name__}")
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
        print(f"\n   🔄 Converting product:")
        print(f"      Raw product type: {type(product)}")
        
        # Debug: Print ALL available attributes
        print(f"      Available attributes: {dir(product)}")
        
        # Check what fields exist and have values
        print(f"      product.id = '{product.id if hasattr(product, 'id') else 'N/A'}'")
        print(f"      product.name = '{product.name if hasattr(product, 'name') else 'N/A'}'")
        print(f"      product.title = '{product.title if hasattr(product, 'title') else 'N/A'}'")
        print(f"      Has price_info: {hasattr(product, 'price_info')}")
        
        if hasattr(product, 'price_info') and product.price_info:
            pi = product.price_info
            print(f"      price_info object: {pi}")
            print(f"      price_info.price = {pi.price if hasattr(pi, 'price') else 'N/A'}")
            print(f"      price_info.currency_code = {pi.currency_code if hasattr(pi, 'currency_code') else 'N/A'}")
        
        # Extract price info
        price_info = None
        if hasattr(product, 'price_info') and product.price_info:
            pi = product.price_info
            price_info = {
                "currency_code": pi.currency_code if hasattr(pi, 'currency_code') else 'USD',
                "price": float(pi.price) if hasattr(pi, 'price') and pi.price else 0.0,
                "original_price": float(pi.original_price) if hasattr(pi, 'original_price') and pi.original_price else None,
                "cost": float(pi.cost) if hasattr(pi, 'cost') and pi.cost else None
            }
        
        print(f"      Converted price_info: {price_info}")
        
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
        
        result = {
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
        
        print(f"      Final result title: {result['title']}")
        print(f"      Final result price_info: {result['price_info']}")
        
        return result

# Singleton instance
retail_search_service = RetailSearchService()
