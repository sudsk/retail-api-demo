import os
from dotenv import load_dotenv

load_dotenv()

GCP_PROJECT_ID = os.getenv("GCP_PROJECT_ID")
CATALOG_PATH = f"projects/{GCP_PROJECT_ID}/locations/global/catalogs/default_catalog"
SEARCH_PLACEMENT = f"{CATALOG_PATH}/placements/default_search"

MODELS = {
    "recently_viewed": "recently_viewed_default",
    "similar_items": "similar_items",
    "frequently_bought_together": "frequently_bought_together",
}

# Set credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "./service-account-key.json")
