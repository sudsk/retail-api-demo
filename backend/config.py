from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # GCP Configuration
    GCP_PROJECT_ID: str
    GCP_REGION: str = "global"  # Changed to global
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None  # Made optional for ADC
    
    # Retail API Configuration
    RETAIL_CATALOG_ID: str = "default_catalog"
    RETAIL_BRANCH_ID: str = "0"
    
    # Serving Configs
    RETAIL_SEARCH_PLACEMENT: str = "default_search"
    
    # Recommendation Models
    MODEL_RECENTLY_VIEWED: str = "recently_viewed_default"
    MODEL_OTHERS_YOU_MAY_LIKE: str = "others_you_may_like"
    MODEL_SIMILAR_ITEMS: str = "similar_items"
    MODEL_FREQUENTLY_BOUGHT_TOGETHER: str = "frequently_bought_together"
    MODEL_RECOMMENDED_FOR_YOU: str = "recommended_for_you"
    
    # Server Configuration
    PORT: int = 8080
    ENVIRONMENT: str = "development"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    
    @property
    def catalog_path(self) -> str:
        """Build catalog path - uses 'global' as location"""
        return f"projects/{self.GCP_PROJECT_ID}/locations/global/catalogs/{self.RETAIL_CATALOG_ID}"
    
    @property
    def branch_path(self) -> str:
        """Build branch path"""
        return f"{self.catalog_path}/branches/{self.RETAIL_BRANCH_ID}"
    
    def get_placement_path(self, placement: str) -> str:
        """Build placement path"""
        return f"{self.catalog_path}/placements/{placement}"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Parse ALLOWED_ORIGINS from comma-separated string if needed
def parse_origins(v):
    if isinstance(v, str):
        return [origin.strip() for origin in v.split(",")]
    return v

# Initialize settings
settings = Settings()

# Parse ALLOWED_ORIGINS if it's a string
if isinstance(settings.ALLOWED_ORIGINS, str):
    settings.ALLOWED_ORIGINS = parse_origins(settings.ALLOWED_ORIGINS)

# Set Google credentials environment variable only if provided
if settings.GOOGLE_APPLICATION_CREDENTIALS:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS
