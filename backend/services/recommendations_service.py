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
        
        # Build user event for context
        product_details = []
        if product_id:
            product_details.append(
                ProductDetail(
                    product=Product(id=product_id)
                )
            )
        
        user_event = UserEvent(
            event_type="detail-page-view",
            visitor_id=visitor_id or self._generate_visitor_id(),
            product_details=product_details
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
            print(f"Recommendations error: {e}")
            raise
    
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
recommendations_service = RecommendationsService()
