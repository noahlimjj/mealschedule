# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Meal Schedule App to enable real-time synchronization across devices.

## Prerequisites

- A Google account
- Node.js and npm installed (already done)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Meal Schedule App")
4. (Optional) Enable Google Analytics
5. Click **"Create project"** and wait for it to be ready
6. Click **"Continue"** when setup is complete

## Step 2: Register Your Web App

1. In the Firebase Console, click on the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "Meal Schedule Web")
3. **DO NOT** check "Also set up Firebase Hosting" (we'll use Netlify)
4. Click **"Register app"**
5. You'll see your Firebase configuration object - **keep this page open!**

## Step 3: Set Up Firestore Database

1. In the Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - This allows read/write access for 30 days
   - You can change this later for production
4. Select a Firestore location (choose closest to your users)
5. Click **"Enable"**

### Security Rules (For Production)

After testing, update your Firestore rules:

1. Go to **Firestore Database** > **Rules**
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to groups collection
    match /groups/{groupId} {
      // Anyone can read groups
      allow read: if true;

      // Anyone can create a group
      allow create: if true;

      // Anyone can update a group (for now)
      // TODO: Add authentication to restrict updates
      allow update: if true;

      // Prevent deletion
      allow delete: if false;
    }
  }
}
```

## Step 4: Configure Your App

1. Copy your Firebase configuration from Step 2 (or find it in Project Settings > General)

2. Create a `.env` file in your project root:

```bash
cp .env.example .env
```

3. Open `.env` and fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

4. **Important:** The `.env` file is already in `.gitignore` - never commit it to Git!

## Step 5: Update Your Code to Use Firebase

1. Open [src/main.tsx](src/main.tsx)

2. Replace the import statement:

```typescript
// Change this:
import { MealProvider } from './context/MealContext.tsx'

// To this:
import { MealProvider } from './context/MealContextFirebase.tsx'
```

3. Save the file

## Step 6: Test Your Firebase Integration

1. Restart your development server:

```bash
npm run dev
```

2. Open the app in your browser
3. Create a new group and add some data
4. Check your Firebase Console > Firestore Database
5. You should see your data appearing in real-time!

## Step 7: Test Real-Time Sync

1. Open your app in two different browser windows
2. Create a group in one window
3. In the second window, refresh and join the same group
4. Toggle meals in one window - they should appear immediately in the other!

## Troubleshooting

### "Firebase not configured" or using LocalStorage

- Make sure your `.env` file exists and has all the values
- Restart the development server after creating `.env`
- Check that variable names start with `VITE_` (required by Vite)

### Permission Denied errors

- Make sure Firestore is in "test mode" for development
- Check your Firestore security rules

### Data not syncing

- Open browser DevTools > Console to check for errors
- Verify your Firebase configuration in `.env`
- Check your internet connection

## For Production Deployment on Netlify

1. In your Netlify project settings, go to **Environment Variables**

2. Add all your Firebase environment variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. Redeploy your site

4. Update Firestore security rules (see above)

## Current Status

- ✅ Firebase SDK installed
- ✅ Firebase configuration file created
- ✅ Firestore service layer created
- ✅ Real-time listeners implemented
- ✅ Fallback to LocalStorage when Firebase not configured
- ⏳ **Next:** Follow this guide to configure Firebase!

## Benefits of Firebase

Once configured, you'll get:

- **Real-time synchronization** - Changes appear instantly across all devices
- **Persistent storage** - Data saved in the cloud, not just browser
- **Multi-device support** - Access from anywhere
- **Offline support** - Firebase caches data locally
- **Scalability** - Handles multiple users easily

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs/firestore)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
