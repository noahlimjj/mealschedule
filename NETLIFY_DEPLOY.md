# Netlify Deployment Guide

This app is a **static Vite + React app** that can be easily deployed to Netlify.

## Quick Deploy

### Option 1: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the app
npm run build

# Deploy
netlify deploy --prod
```

### Option 2: Deploy via Git Integration

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Configure build settings (see below)
6. Click "Deploy site"

## Build Settings

When deploying on Netlify, use these settings:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `22` (set in netlify.toml)

## Environment Variables

You **must** set up Firebase environment variables in Netlify:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:

```
VITE_FIREBASE_API_KEY=AIzaSyAJ8ZhAsauJXKeZtvGEUtghkKp4dgpn0PQ
VITE_FIREBASE_AUTH_DOMAIN=mealschedule-2de87.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mealschedule-2de87
VITE_FIREBASE_STORAGE_BUCKET=mealschedule-2de87.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=638866220167
VITE_FIREBASE_APP_ID=1:638866220167:web:d76d5fb56cc51823df8422
```

> **Note**: These are your actual Firebase credentials from `.env.netlify`

## Troubleshooting

### 500 Internal Server Error

If you get a 500 error, check:

1. **Environment variables are set**: Make sure all `VITE_*` variables are configured in Netlify
2. **Build succeeded**: Check the deploy log in Netlify for any build errors
3. **Node version**: Ensure Node 22 is being used (configured in netlify.toml)
4. **Clear cache and redeploy**: In Netlify, go to Deploys → Trigger deploy → Clear cache and deploy site

### Build Fails

If the build fails:

1. **Test locally first**: Run `npm run build` locally to catch errors
2. **Check TypeScript errors**: All TS errors must be fixed before deployment
3. **Install dependencies**: Make sure `npm install` runs successfully

### App loads but data doesn't persist

1. **Firebase credentials**: Double-check all environment variables are set correctly
2. **Firebase rules**: Ensure Firestore security rules allow read/write
3. **Browser console**: Check for Firebase authentication errors

## Local Testing

Test the production build locally before deploying:

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

This will serve the built app at `http://localhost:4173/`

## Automatic Deployments

Once connected to GitHub, Netlify will automatically:
- Deploy when you push to the `main` branch
- Create preview deployments for pull requests
- Show build status in GitHub

## Static App Features

This is a fully static app that:
- ✅ Runs entirely in the browser (no backend needed)
- ✅ Uses Firebase for real-time data sync
- ✅ Falls back to localStorage if Firebase isn't configured
- ✅ Works offline after initial load (PWA-ready)
- ✅ Can be hosted on any static hosting (Netlify, Vercel, GitHub Pages, etc.)

## Files for Netlify

- `netlify.toml` - Netlify configuration (redirects, build settings)
- `public/_redirects` - SPA routing support
- `.nvmrc` - Node version specification

## Post-Deployment

After deploying:
1. Visit your Netlify URL
2. Add people to your group
3. Start tracking meals!

Your data will sync in real-time across all users connected to the same Firebase project.
