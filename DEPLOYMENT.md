# Deploying Sheila to Google Cloud Run

This project is fully containerized and configured for deployment on **Google Cloud Run**.

---

## Architecture Overview
- **Frontend**: React 19 + Vite SPA with Tailwind CSS
- **Backend**: Express + Node.js with Google Gemini & Google Calendar API routing
- **Container**: Multi-stage Alpine container (exposes `$PORT`, default `8080`)

---

## Step-by-Step Deployment Instructions

### Step 1: Install & Authenticate Google Cloud CLI
If you haven't installed `gcloud` yet:
- Install instructions: https://cloud.google.com/sdk/docs/install

Authenticate:
```bash
gcloud auth login
```

---

### Step 2: Set or Create Your Google Cloud Project
```bash
# Set your active GCP project ID
gcloud config set project YOUR_PROJECT_ID
```

Enable required Google Cloud services:
```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  generativelanguage.googleapis.com
```

---

### Step 3: Store Your Gemini API Key in Google Secret Manager
```bash
# Enable Secret Manager
gcloud services enable secretmanager.googleapis.com

# Create the secret for your Gemini API Key
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create GEMINI_API_KEY --data-file=-

# Grant Cloud Run default service account permission to access the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:$(gcloud projects describe $(gcloud config get-value project) --format='value(projectNumber)')-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

### Step 4: Deploy Directly to Cloud Run
From the root of this project:
```bash
gcloud run deploy sheila \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --set-secrets GEMINI_API_KEY=GEMINI_API_KEY:latest
```

This single command:
1. Uploads your code to Cloud Build
2. Builds the multi-stage Docker container
3. Provisions a serverless Google Cloud Run instance
4. Prints your live HTTPS production URL (e.g. `https://sheila-xxxxxx-uc.a.run.app`)

---

### Step 5: Configure Google OAuth (For Google Calendar Integration)
1. Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials).
2. Edit your **OAuth 2.0 Client ID**.
3. Under **Authorized JavaScript origins**, add:
   - `https://sheila-xxxxxx-uc.a.run.app`
4. Under **Authorized redirect URIs**, add:
   - `https://sheila-xxxxxx-uc.a.run.app`
5. Save changes.
