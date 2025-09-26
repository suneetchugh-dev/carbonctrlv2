# Vercel Environment Variables Setup

## Required Environment Variables

Add these to your Vercel project settings:

### 1. OpenAI API Key (for Chatbot)
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Firebase Configuration
```
VITE_FIREBASE_API_KEY=AIzaSyCmZ0hNd5BzujSIj9bH1xfB0bG-x5xuV4A
VITE_FIREBASE_AUTH_DOMAIN=tiffintrail-c98c2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tiffintrail-c98c2
VITE_FIREBASE_STORAGE_BUCKET=tiffintrail-c98c2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=515247991697
VITE_FIREBASE_APP_ID=1:515247991697:web:8b84a40ab54d05bc9a4830
VITE_FIREBASE_MEASUREMENT_ID=G-BWD2YNHJHB
```

### 3. Optional Variables
```
NODE_ENV=production
PING_MESSAGE=ping
```

## How to Add Environment Variables in Vercel

### Method 1: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `carbonctrlv2` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: `your_actual_openai_key`
   - **Environment**: Production, Preview, Development (check all)
5. Click **Save**
6. Repeat for all Firebase variables

### Method 2: Vercel CLI
```bash
# Add OpenAI key
vercel env add OPENAI_API_KEY

# Add Firebase variables
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
vercel env add VITE_FIREBASE_MEASUREMENT_ID
```

## After Adding Variables

1. **Redeploy** your project:
   ```bash
   vercel --prod
   ```

2. **Test the deployment**:
   - Visit your production URL
   - Test Firebase authentication (login/register)
   - Test the chatbot (should work with OpenAI key)

## Security Notes

- ✅ Firebase config is safe to expose (public keys)
- ✅ OpenAI key is server-side only (secure)
- ✅ All variables are encrypted in Vercel
- ✅ Environment variables are not visible in client-side code

## Troubleshooting

### If Firebase auth doesn't work:
- Check that all `VITE_FIREBASE_*` variables are set
- Verify the values match your Firebase console
- Ensure variables are set for Production environment

### If chatbot doesn't work:
- Verify `OPENAI_API_KEY` is set correctly
- Check that the key has sufficient credits
- Test the `/api/chatbot` endpoint directly

### If deployment fails:
- Check Vercel build logs
- Ensure all environment variables are properly formatted
- Redeploy after adding variables
