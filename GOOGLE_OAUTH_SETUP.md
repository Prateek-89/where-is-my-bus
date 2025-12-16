# Google OAuth Setup Guide

## Steps to Get Google Client ID

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project (or select existing)**
   - Click on the project dropdown at the top
   - Click "New Project"
   - Enter project name (e.g., "Bus Tracking App")
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "People API"
   - Click on it and click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure OAuth consent screen first:
     - Choose "External" (for testing) or "Internal" (for Google Workspace)
     - Fill in required fields:
       - App name: "Bus Tracking"
       - User support email: Your email
       - Developer contact: Your email
     - Click "Save and Continue"
     - Add scopes: `email`, `profile`, `openid`
     - Click "Save and Continue"
     - Add test users (your email) if using External
     - Click "Save and Continue"
     - Review and go back to dashboard

5. **Create OAuth Client ID**
   - Application type: "Web application"
   - Name: "Bus Tracking Web Client"
   - **Authorized JavaScript origins** (REQUIRED for the GSI button):
     - `http://localhost:5173`
     - `http://127.0.0.1:5173`
     - Any other dev/prod origins you use
   - **Authorized redirect URIs** (optional – only needed if you later switch to the redirect-based OAuth flow):
     - `http://localhost:8000/api/auth/google/callback`
     - Production API callback (if applicable)
   - Click "Create"
   - Copy the **Client ID**

   **⚠️ CRITICAL:** If you see "The given origin is not allowed" error:
   - Go back to Google Cloud Console > APIs & Services > Credentials
   - Click on your OAuth 2.0 Client ID
   - Under "Authorized JavaScript origins", add the EXACT URL you're using (e.g., `http://localhost:5173`)
   - Make sure there's NO trailing slash
   - Click "Save"
   - Wait 1-2 minutes for changes to propagate
   - Refresh your app and try again

6. **Add to Environment Variables**

   **Server `.env` file:**
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   CLIENT_URLS=http://localhost:5173,http://127.0.0.1:5173
   ```

   **Client `.env` file (create if doesn't exist):**
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```

7. **Restart Your Servers**
   - Restart backend server
   - Restart frontend dev server

8. **Sync Allowed Origins Everywhere**
   - In `server/.env`, keep `CLIENT_URLS` in sync with every frontend URL you actually use. The backend CORS middleware only allows these origins.

## Testing

1. Go to login page
2. You should see "Sign in with Google" button
3. Click it and select your Google account
4. You should be logged in automatically

## Troubleshooting

### Error: "The given origin is not allowed for the given client ID"

**Solution:**
1. Check what port your frontend is running on (check terminal output, usually `http://localhost:XXXX`)
2. Go to [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Credentials
3. Click on your OAuth 2.0 Client ID
4. Under "Authorized JavaScript origins", add:
   - The exact URL from your browser (e.g., `http://localhost:5173`)
   - Make sure there's NO trailing slash (`/`)
   - Include the protocol (`http://` or `https://`)
5. Click "Save"
6. Wait 1-2 minutes for changes to take effect
7. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

### Error: "Invalid Google token" / "Token audience mismatch"

**Possible causes:**
1. Frontend still running with an old build that references a different `VITE_GOOGLE_CLIENT_ID` (restart Vite).
2. Backend not restarted after changing `GOOGLE_CLIENT_ID`.
3. Google Cloud Console changes have not propagated yet (wait a minute and retry).

### Error: "Provided button width is invalid: 100%"

**Solution:** This is fixed in the code. The button width property has been removed. Google Sign-In will automatically size the button to fit the container.

### Redirect keeps looping back to login

**Check:**
1. Confirm `/google-callback` route exists in the frontend and that `GOOGLE_CLIENT_REDIRECT` points to it.
2. Inspect the query string for `error`—if present, Google rejected the auth request (view the value for clues).
3. Ensure `JWT_SECRET` matches between deployments; otherwise the callback stores a token the API can’t validate.

## Notes

- The same Client ID is used for both frontend and backend
- For production, update authorized origins and redirect URIs
- Test users need to be added if app is in "Testing" mode
- The app needs to be published for public use (after testing)
- Vite default port is 5173, but check your terminal to confirm

