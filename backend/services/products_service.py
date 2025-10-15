from google.cloud.retail_v2 import ProductServiceClient
from google.cloud.retail_v2.types import GetProductRequest, ListProductsRequest
from typing import Dict, Any

from config import settings

class ProductsService:
    def __init__(self):
        self.product_client = ProductServiceClient()
    
    async def get_product(self, product_id: str) -> Dict[str, Any]:
        """Get a single product by ID"""
        
        name = f"{settings.branch_path}/products/{product_id}"
        
        request = GetProductRequest(name=name)
        
        try:
            product = self.product_client.get_product(request)
            return self._convert_product_to_dict(product)
        
        except Exception as e:
            print(f"Get product error: {e}")
            raise
    
    async def list_products(
        self,
        page_size: int = 20,
        page_token: str = "",
        filter: str = ""
    ) -> Dict[str, Any]:
        """List products with optional filtering"""
        
        parent = settings.branch_path
        
        request = ListProductsRequest(
            parent=parent,
            page_size=page_size,
            page_token=page_token,
            filter=filter
        )
        
        try:
            response = self.product_client.list_products(request)
            
            products = []
            for product in response:
                products.append(self._convert_product_to_dict(product))
            
            return {
                "products": products,
                "next_page_token": response.next_page_token if hasattr(response, 'next_page_token') else ""
            }
        
        except Exception as e:
            print(f"List products error: {e}")
            raise
    
    def _convert_product_to_dict(self, product) -> Dict[str, Any]:
        """Convert Product protobuf to dict"""
        return {
            "id": product.id,
            "name": product.name,
            "title": product.title,
            "description": product.description,
            "categories": list(product.categories),
            "brands": list(product.brands),
            "price_info": {
                "currency_code": product.price_info.currency_code,
                "price": product.price_info.price,
                "original_price": product.price_info.original_price,
                "cost": product.price_info.cost
            } if product.price_info else None,
            "availability": product.availability,
            "uri": product.uri,
            "images": [{"uri": img.uri, "height": img.height, "width": img.width} for img in product.images],
            "attributes": {k: list(v.text) if v.text else [] for k, v in product.attributes.items()}
        }

# Singleton instance
products_service = ProductsService()
