from google.cloud.retail_v2 import PredictionServiceClient
from google.cloud.retail_v2.types import PredictRequest, UserEvent, ProductDetail, Product
from typing import Dict, Any, List
import uuid

from config import settings

class RecommendationsService:
    def __init__(self):
        self.prediction_client = PredictionServiceClient()
    
    async def get_recommendations(
        self,
        model: str,
        visitor_id: str = None,
        product_id: str = None,
        page_size: int = 10,
        filter: str = "",
        params: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Get product recommendations"""
        
        # Map model name to serving config
        serving_config = self._get_serving_config(model)
        placement = settings.get_placement_path(serving_config)
        
        # Determine event type based on model
        # Models that require product_id use detail-page-view
        # Models that don't use home-page-view
        requires_product = model in ['similar_items', 'frequently_bought_together']
        
        # Build product details only if product_id is provided and required
        product_details = []
        if product_id and requires_product:
            product_details.append(
                ProductDetail(
                    product=Product(id=product_id)
                )
            )
        
        # Choose appropriate event type
        event_type = "detail-page-view" if product_details else "home-page-view"
        
        # Build user event for context
        user_event = UserEvent(
            event_type=event_type,
            visitor_id=visitor_id or self._generate_visitor_id(),
            product_details=product_details if product_details else None
        )
        
        # Build request
        request = PredictRequest(
            placement=placement,
            user_event=user_event,
            page_size=page_size,
            filter=filter,
            params=params or {}
        )
        
        try:
            response = self.prediction_client.predict(request)
            
            # Convert response to dict
            results = []
            for result in response.results:
                results.append({
                    "id": result.id,
                    "product": self._convert_product_to_dict(result.product)
                })
            
            return {
                "results": results,
                "attribution_token": response.attribution_token,
                "missing_ids": list(response.missing_ids),
                "validate_only": response.validate_only
            }
        
        except Exception as e:
            print(f"Recommendations error for model {model}: {e}")
            # Return empty results instead of failing
            return {
                "results": [],
                "attribution_token": "",
                "missing_ids": [],
                "validate_only": False,
                "error": str(e)
            }
    
    def get_available_models(self) -> List[Dict[str, Any]]:
        """Get available recommendation models"""
        return [
            {
                "id": "recently_viewed",
                "name": "Recently Viewed",
                "description": "Products the user has recently viewed",
                "serving_config": settings.MODEL_RECENTLY_VIEWED
            },
            {
                "id": "others_you_may_like",
                "name": "Others You May Like",
                "description": "Personalized recommendations based on user behavior",
                "serving_config": settings.MODEL_OTHERS_YOU_MAY_LIKE
            },
            {
                "id": "similar_items",
                "name": "Similar Products",
                "description": "Products similar to the current product",
                "serving_config": settings.MODEL_SIMILAR_ITEMS,
                "requires_product_id": True
            },
            {
                "id": "frequently_bought_together",
                "name": "Frequently Bought Together",
                "description": "Products often purchased together",
                "serving_config": settings.MODEL_FREQUENTLY_BOUGHT_TOGETHER,
                "requires_product_id": True
            },
            {
                "id": "recommended_for_you",
                "name": "Recommended For You",
                "description": "Personalized product recommendations",
                "serving_config": settings.MODEL_RECOMMENDED_FOR_YOU
            }
        ]
    
    def _get_serving_config(self, model_id: str) -> str:
        """Map model ID to serving config"""
        model_map = {
            "recently_viewed": settings.MODEL_RECENTLY_VIEWED,
            "others_you_may_like": settings.MODEL_OTHERS_YOU_MAY_LIKE,
            "similar_items": settings.MODEL_SIMILAR_ITEMS,
            "frequently_bought_together": settings.MODEL_FREQUENTLY_BOUGHT_TOGETHER,
            "recommended_for_you": settings.MODEL_RECOMMENDED_FOR_YOU
        }
        return model_map.get(model_id, settings.MODEL_RECOMMENDED_FOR_YOU)
    
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
recommendations_service = RecommendationsService()
