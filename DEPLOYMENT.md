# Deploying Sheila to Google Cloud Run with GitHub Integration

This project is fully containerized and configured for automated continuous deployment (CI/CD) from **GitHub (`ashisin17/sheila`)** to **Google Cloud Run**.

---

## 🔒 Security & Secrets Management (Zero Secrets in Git)

- **No Secrets in Code**: No API keys, client secrets, or credentials are saved or tracked in git.
- **Git & Docker Ignored**: `.gitignore` and `.dockerignore` exclude all `.env*` files, `.pem`/`.key` certificates, service account credentials, and build artifacts.
- **Secret Manager**: Production secrets (like `GEMINI_API_KEY`) are stored in Google Cloud Secret Manager and mounted at runtime into Cloud Run without being exposed in build logs or source code.

---

## Method 1: Connect GitHub Repo to Google Cloud Run (Recommended - Managed by Google)

Google Cloud Run provides a direct, native GitHub connection with zero credential setup:

1. **Open Google Cloud Console**:
   Navigate to [Cloud Run](https://console.cloud.google.com/run).
2. **Create or Edit Service**:
   - Click **Create Service** (or select `sheila`).
   - Service name: `sheila`
   - Region: `us-central1` (or your preferred region).
3. **Select Deployment Type**:
   - Choose **"Continuously deploy from a repository"** -> Click **SET UP CLOUD BUILD**.
   - **Repository Provider**: GitHub.
   - **Repository**: Select `ashisin17/sheila`.
   - **Branch**: `^main$`.
   - **Build Type**: Select **Dockerfile** (path: `/Dockerfile`).
4. **Environment Variables & Secrets**:
   - Under **Variables & Secrets**:
     - Add Environment Variable: `NODE_ENV=production`
     - Click **Reference a Secret**:
       - Name: `GEMINI_API_KEY`
       - Secret: Select `GEMINI_API_KEY` (version: `latest`)
5. **Authentication**:
   - Select **"Allow unauthenticated invocations"** (public access).
6. **Click Save / Create**:
   - Google Cloud Build will automatically build and deploy whenever you merge a PR into `main`.

---

## Method 2: Automated Deployment via GitHub Actions

A pre-configured GitHub Actions workflow is included at `.github/workflows/deploy.yml`.

### Setup:
1. In your Google Cloud project, create a service account for GitHub deployment:
   ```bash
   # Create Service Account
   gcloud iam service-accounts create github-deployer \
     --display-name="GitHub Actions Deployer"

   # Grant required roles
   PROJECT_ID=$(gcloud config get-value project)

   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:github-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"

   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:github-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"

   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:github-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/artifactregistry.writer"

   # Generate key JSON
   gcloud iam service-accounts keys create sa-key.json \
     --iam-account="github-deployer@$PROJECT_ID.iam.gserviceaccount.com"
   ```

2. Add the key to **GitHub Repository Secrets**:
   - Go to your GitHub repository: [ashisin17/sheila > Settings > Secrets and variables > Actions](https://github.com/ashisin17/sheila/settings/secrets/actions).
   - Add Secret: `GCP_SA_KEY` (paste the content of `sa-key.json`).
   - Add Secret: `GCP_PROJECT_ID` (your Google Cloud project ID).
   - Delete the local `sa-key.json` file.

3. Pushing or merging to `main` will now automatically trigger the GitHub Actions workflow and deploy your latest version to Google Cloud Run!

---

## Configure Google Calendar OAuth for Production

Once Cloud Run outputs your production URL (e.g., `https://sheila-xxxxxx-uc.a.run.app`):
1. In [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials):
2. Click on your **OAuth 2.0 Client ID**.
3. Under **Authorized JavaScript origins**, add:
   - `https://sheila-xxxxxx-uc.a.run.app`
4. Under **Authorized redirect URIs**, add:
   - `https://sheila-xxxxxx-uc.a.run.app`
5. Save changes.
