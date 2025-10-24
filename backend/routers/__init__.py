from .search import router as search_router
from .products import router as products_router
from .recommendations import router as recommendations_router
from .categories import router as categories_router

__all__ = ["search_router", "products_router", "recommendations_router", "categories_router"]
