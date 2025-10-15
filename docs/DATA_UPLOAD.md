# Data Upload Guide

Upload product catalog and user events data via GCP Console.

## Step 1: Enable Retail API

1. Go to GCP Console
2. Search for "Retail API"
3. Click "Enable API"
4. Accept terms and conditions

## Step 2: Access Retail Console

1. In GCP Console, search for "Search for Commerce"
2. Click on "Search for Commerce"
3. You'll see the Retail API console

## Step 3: Import Product Catalog

### Option A: From BigQuery

1. In Retail Console, click "Data" → "Catalog" tab
2. Click "Import"
3. Select:
   - Import type: Product Catalog
   - Source: BigQuery
   - Branch: Branch 0
4. Click "Browse" and select your BigQuery table
5. Click "Import"

**Sample BigQuery Schema:**
```sql
CREATE TABLE `project.dataset.products` (
  id STRING,
  title STRING,
  description STRING,
  categories ARRAY<STRING>,
  brands ARRAY<STRING>,
  price FLOAT64,
  currency_code STRING,
  availability STRING,
  uri STRING,
  images ARRAY<STRUCT<uri STRING, height INT64, width INT64>>
);
```

### Option B: From Cloud Storage

1. Prepare JSON/JSONL file with products
2. Upload to Cloud Storage bucket
3. In Retail Console: Data → Catalog → Import
4. Select Cloud Storage as source
5. Browse and select your file

**Sample Product JSON:**
```json
{
  "id": "PROD001",
  "title": "Cordless Drill",
  "description": "18V cordless drill with 2 batteries",
  "categories": ["Tools & Equipment"],
  "brands": ["ToolMaster"],
  "priceInfo": {
    "currencyCode": "USD",
    "price": 129.99
  },
  "availability": "IN_STOCK",
  "uri": "https://example.com/products/drill-001",
  "images": [
    {
      "uri": "https://example.com/images/drill-001.jpg"
    }
  ]
}
```

## Step 4: Import User Events

1. In Retail Console, click "Data" → "Events" tab
2. Click "Import"
3. Select:
   - Import type: User Events
   - Source: Cloud Storage
4. Browse and select your events JSON file
5. Click "Import"

**Sample User Event JSON:**
```json
{
  "eventType": "detail-page-view",
  "visitorId": "visitor_12345",
  "eventTime": "2024-01-15T10:30:00Z",
  "productDetails": [
    {
      "product": {
        "id": "PROD001"
      }
    }
  ],
  "userInfo": {
    "userId": "user_67890"
  }
}
```

**Event Types:**
- `detail-page-view` - Product page views
- `add-to-cart` - Add to cart actions
- `purchase` - Purchases
- `search` - Search queries

## Step 5: Configure Serving Configs

1. In Retail Console, go to "Serving configs"
2. Default configs are created automatically
3. Note the serving config IDs (e.g., `default_search`)
4. Update these in your backend `.env` file

## Step 6: Verify Data Import

1. Check "Activity status" in Retail Console
2. Wait for imports to complete (status: Succeeded)
3. Verify product count in Catalog tab
4. Verify event count in Events tab

## Step 7: Test in Demo App

1. Start backend and frontend
2. Try searching for products
3. View product details
4. Check if recommendations appear

## Sample Data

For testing, you can use the sample data from Google's lab:

**Products:**
- BigQuery table: `bigquery-public-data.retail.products`

**Events:**
- File: Available in Google Cloud samples

## Troubleshooting

**Import fails:**
- Check JSON/JSONL format
- Verify schema matches Retail API requirements
- Check IAM permissions

**No search results:**
- Wait for indexing to complete (up to 5 minutes)
- Verify data imported successfully
- Check serving config in backend .env

**Recommendations not working:**
- Ensure user events are imported
- Need minimum data (see Retail API docs)
- Some models require 7+ days of events

## Data Requirements for Recommendations

Different models have different requirements:

- **Recently Viewed**: Needs detail-page-view events
- **Similar Items**: Needs product catalog only
- **Frequently Bought Together**: Needs purchase events
- **Others You May Like**: Needs diverse event types

For PoC, focus on importing:
1. Complete product catalog
2. 6-12 months of user events (if available)
