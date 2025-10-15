import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Navigation from '../components/layout/# Retail API Demo - Complete Code Implementation (FastAPI + React)

## Project Setup

### Initialize Repository
````bash
mkdir retail-api-demo
cd retail-api-demo
git init
````

---

## Root Level Files

### `README.md`
````markdown
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
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm start
```

### Data Upload

See `docs/DATA_UPLOAD.md` for instructions on uploading catalog and events via GCP Console.

## Architecture
````
Frontend (React) → Backend (FastAPI/Python) → Google Retail API
