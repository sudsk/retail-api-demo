from google.cloud.retail_v2 import PredictionServiceClient
from google.cloud.retail_v2.types import PredictRequest, UserEvent, ProductDetail, Product
from config import CATALOG_PATH, MODELS
import uuid

prediction_client = PredictionServiceClient()

async def get_recommendations(model: str, product_id: str = None, visitor_id: str = None, page_size: int = 6):
    serving_config = MODELS.get(model, "recently_viewed_default")
    placement = f"{CATALOG_PATH}/placements/{serving_config}"
    
    product_details = []
    if product_id:
        product_details.append(ProductDetail(product=Product(id=product_id)))
    
    user_event = UserEvent(
        event_type="detail-page-view",
        visitor_id=visitor_id or f"visitor_{uuid.uuid4().hex[:16]}",
        product_details=product_details
    )
    
    request = PredictRequest(
        placement=placement,
        user_event=user_event,
        page_size=page_size
    )
    
    response = prediction_client.predict(request)
    
    return {
        "results": [
            {
                "id": r.product.id,
                "title": r.product.title,
                "price": r.product.price_info.price if r.product.price_info else 0,
                "image": r.product.images[0].uri if r.product.images else "",
            }
            for r in response.results
        ]
    }
