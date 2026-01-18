# Setup Guide for Meeting Fatigue Calculator

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Google Cloud Project** with Calendar API enabled
3. **Google Gemini API Key**

## Step 1: Google Cloud Setup

### Enable Google Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services** > **Library**
4. Search for "Google Calendar API" and enable it
5. Search for "Google People API" and enable it (for user info)

### Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Add authorized redirect URIs:
   - Development: `http://localhost:3001/auth/google/callback`
   - Production: `https://your-backend-url.onrender.com/auth/google/callback`
5. Copy the **Client ID** and **Client Secret**

## Step 2: Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the API key

## Step 3: Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your credentials:

```env
PORT=3001
NODE_ENV=development

# From Google Cloud Console
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

# From Google AI Studio
GEMINI_API_KEY=your_gemini_api_key

FRONTEND_URL=http://localhost:5173
SESSION_SECRET=random_secret_string_change_this
```

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:3001`

## Step 4: Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Step 5: Test Locally

1. Open `http://localhost:5173`
2. Click "Analyze with Google Calendar"
3. Authenticate with Google
4. View your meeting fatigue analysis

## Deployment

### Deploy Backend to Render

1. Push your code to GitHub
2. Go to [Render](https://render.com/)
3. Click **New** > **Web Service**
4. Connect your GitHub repo
5. Use these settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Add environment variables from your `.env` file
7. Update `GOOGLE_REDIRECT_URI` to your Render URL
8. Update `FRONTEND_URL` to your Vercel URL (after frontend deployment)
9. Deploy

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click **Import Project**
4. Select your GitHub repo
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
6. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL
7. Deploy

### Update OAuth Redirect URIs

After deployment, update Google Cloud Console:

1. Go to OAuth 2.0 Client credentials
2. Add your production redirect URI:
   - `https://your-backend.onrender.com/auth/google/callback`
3. Save

## Troubleshooting

### "Missing authorization code"
- Check that `GOOGLE_REDIRECT_URI` in backend `.env` matches Google Cloud Console exactly

### "Failed to fetch calendar events"
- Ensure Google Calendar API is enabled
- Check that OAuth scopes include `calendar.readonly`

### "AI categorization failed"
- Verify Gemini API key is correct
- Check API quota limits

### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly

### Backend not starting
- Run `npm install` again
- Check all environment variables are set
- Ensure port 3001 is not in use

## Cost Breakdown

All services used are FREE for moderate usage:

- **Vercel**: Free tier includes unlimited deployments
- **Render**: Free tier includes 750 hours/month
- **Google Calendar API**: Free (100,000 requests/day)
- **Google Gemini API**: Free tier includes 60 requests/minute

## Security Notes

- Never commit `.env` files
- Rotate API keys regularly
- Use different OAuth credentials for dev and prod
- Enable rate limiting for production

## Support

For issues, check:
1. Backend logs: `npm run dev` output
2. Frontend console: Browser DevTools
3. Network tab: Check API requests/responses
