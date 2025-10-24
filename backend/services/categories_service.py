from google.cloud.retail_v2 import SearchServiceClient
from google.cloud.retail_v2.types import SearchRequest
from typing import List, Dict, Any
from datetime import datetime, timedelta
import uuid

from config import settings

class CategoriesService:
    def __init__(self):
        self.search_client = SearchServiceClient()
        # Simple in-memory cache
        self._cache = None
        self._cache_timestamp = None
        self._cache_duration = timedelta(hours=1)  # Cache for 1 hour
    
    async def get_categories(self) -> List[Dict[str, Any]]:
        """Get all unique categories from the catalog with caching"""
        
        # Check if cache is valid
        if self._cache and self._cache_timestamp:
            if datetime.now() - self._cache_timestamp < self._cache_duration:
                print("Returning cached categories")
                return self._cache
        
        print("Fetching categories from Retail API")
        
        placement = settings.get_placement_path(settings.RETAIL_SEARCH_PLACEMENT)
        
        # Build facet spec to get all categories
        facet_specs = [
            {
                "facet_key": {
                    "key": "categories"
                },
                "limit": 100  # Get up to 100 categories
            }
        ]
        
        # Build search request (empty query to get all products)
        request = SearchRequest(
            placement=placement,
            visitor_id=f"visitor_{uuid.uuid4().hex[:16]}",
            query="",
            page_size=1,  # We only need facets, not products
            facet_specs=facet_specs
        )
        
        try:
            response = self.search_client.search(request)
            
            categories = []
            
            # Extract categories from facets
            for facet in response.facets:
                if facet.key == "categories":
                    for value in facet.values:
                        # Create slug from category name
                        slug = value.value.lower().replace(' & ', '-').replace(' ', '-').replace('&', 'and')
                        
                        categories.append({
                            "name": value.value,
                            "slug": slug,
                            "count": value.count
                        })
            
            # Sort by count (most popular first)
            categories.sort(key=lambda x: x['count'], reverse=True)
            
            # Update cache
            self._cache = categories
            self._cache_timestamp = datetime.now()
            
            return categories
        
        except Exception as e:
            print(f"Categories fetch error: {e}")
            # Return empty list on error
            return []
    
    def clear_cache(self):
        """Clear the categories cache"""
        self._cache = None
        self._cache_timestamp = None

# Singleton instance
categories_service = CategoriesService()
