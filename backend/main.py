from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from config import settings
from routers import search_router, products_router, recommendations_router, categories_router

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"🚀 Starting Retail API Backend")
    print(f"📊 Environment: {settings.ENVIRONMENT}")
    print(f"🔧 GCP Project: {settings.GCP_PROJECT_ID}")
    yield
    # Shutdown
    print("👋 Shutting down Retail API Backend")

# Initialize FastAPI app
app = FastAPI(
    title="Retail API Demo",
    description="Backend API for Vertex AI Retail Search and Recommendations",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "retail-api-backend",
        "environment": settings.ENVIRONMENT
    }

# Include routers
app.include_router(search_router, prefix="/api/search", tags=["Search"])
app.include_router(products_router, prefix="/api/products", tags=["Products"])
app.include_router(recommendations_router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(categories_router, prefix="/api/categories", tags=["Categories"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Retail API Demo Backend",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development"
    )
