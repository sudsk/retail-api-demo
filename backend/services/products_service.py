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
products_service = ProductsService()
