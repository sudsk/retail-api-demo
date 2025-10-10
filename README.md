# Vertex AI Retail API Demo

Generic e-commerce demo showcasing Google Cloud Vertex AI Search for Commerce - integrating both Retail Search and Recommendations API.

## Features

- **Retail Search**: Full-text search with autocomplete and faceted filtering
- **Recommendations**: Multiple recommendation models (Recently Viewed, Similar Products, Frequently Bought Together, etc.)
- **Realistic UX**: Complete e-commerce experience with categories, product pages, and search
- **Customizable**: Easy branding configuration for different clients

## Tech Stack

- **Backend**: FastAPI (Python 3.9+)
- **Frontend**: React 18+
- **APIs**: Google Cloud Vertex AI Retail API

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- GCP Project with Retail API enabled
- Service account key with Retail Editor role

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your GCP project details
uvicorn main:app --reload
