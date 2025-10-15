# Setup Guide

## Prerequisites

- Python 3.9+
- Node.js 18+
- GCP Project with Retail API enabled
- Service account key with Retail Editor role

## Backend Setup

1. **Navigate to backend directory:**
```bash
   cd backend
```

2. **Create virtual environment:**
```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
   pip install -r requirements.txt
```

4. **Configure environment:**
```bash
   cp .env.example .env
```
   
   Edit `.env` and set:
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `GOOGLE_APPLICATION_CREDENTIALS`: Path to service account key
   - Other configuration as needed

5. **Place service account key:**
   - Download service account key from GCP Console
   - Place in `backend/` directory
   - Update path in `.env`

6. **Run backend:**
```bash
   uvicorn main:app --reload
```
   
   Backend will run on `http://localhost:8080`
   
   API docs available at `http://localhost:8080/docs`

## Frontend Setup

1. **Navigate to frontend directory:**
```bash
   cd frontend
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Configure environment:**
```bash
   cp .env.example .env
```
   
   Edit `.env`:
   - `REACT_APP_API_BASE_URL=http://localhost:8080`

4. **Customize branding (optional):**
   Edit `public/config/branding.json` to customize:
   - Site name and tagline
   - Logo
   - Colors
   - Categories

5. **Run frontend:**
```bash
   npm start
```
   
   Frontend will run on `http://localhost:3000`

## Verify Setup

1. Open `http://localhost:3000`
2. You should see the homepage
3. Try searching (will work after data upload)

## Next Steps

Upload data via GCP Console - see `DATA_UPLOAD.md`

