# Firebase App Hosting Deployment Guide

Follow these steps to deploy your Next.js application to Firebase App Hosting.

## Step 1: Initialize Git and Push to GitHub
Firebase App Hosting requires your code to be in a GitHub repository.

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "chore: prepare for firebase app hosting"

# Create a new repository on GitHub and link it
# Replace <your-username> and <your-repo-name>
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```

## Step 2: Enable Firebase App Hosting
You can do this via the Firebase Console or CLI.

### Option A: Firebase Console (Recommended)
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **bharat-5bce5**.
3. In the left sidebar, click on **App Hosting**.
4. Click **Get Started**.
5. Connect your GitHub account and select your repository.
6. Configure the deployment settings (Settings are already provided in `apphosting.yaml`).
7. Click **Finish and Deploy**.

### Option B: Firebase CLI
Run the following command and follow the interactive prompts:
```bash
firebase init apphosting
```

## Step 3: Verify Deployment
Once the build is complete:
1. Firebase will provide a URL (e.g., `https://<your-backend-id>.<region>.run.app` or a `.web.app` custom domain).
2. Visit the URL to ensure everything is working.
3. Check the **App Hosting** dashboard in the Firebase Console to monitor builds and logs.

## Configuration Files Added:
- `apphosting.yaml`: Contains build settings and environment variables.
- `firebase.json`: Associates the project with your Firebase Web App ID.
