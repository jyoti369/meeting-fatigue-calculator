# Quick Start Guide

Get the Meeting Fatigue Calculator running locally in 5 minutes.

## 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 2. Get API Keys

### Google Calendar OAuth (Required)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable "Google Calendar API" and "Google People API"
3. Create OAuth credentials → Add redirect URI: `http://localhost:3001/auth/google/callback`
4. Copy Client ID and Client Secret

### Gemini AI Key (Required)

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create API key
3. Copy the key

## 3. Configure Environment

### Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback
GEMINI_API_KEY=your_gemini_key_here
FRONTEND_URL=http://localhost:5173
```

### Frontend

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

## 4. Run the App

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 5. Test It

1. Open `http://localhost:5173`
2. Click "Analyze with Google Calendar"
3. Authenticate with your Google account
4. View your meeting fatigue report!

## Troubleshooting

**"Missing authorization code"**
→ Make sure redirect URI in `.env` matches Google Cloud Console exactly

**"AI categorization failed"**
→ Check Gemini API key is correct

**Backend won't start**
→ Ensure port 3001 is free: `lsof -ti:3001 | xargs kill -9`

## Next Steps

- Read [SETUP.md](./SETUP.md) for detailed setup instructions
- Read [README.md](./README.md) for project overview
- Deploy to production (Vercel + Render)

## Project Structure

```
meeting-fatigue-calculator/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── services/ # Calendar, AI, Analytics
│   │   └── routes/   # API endpoints
│   └── .env          # Backend config
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── pages/    # Home, Dashboard
│   │   └── components/ # UI components
│   └── .env          # Frontend config
└── README.md
```
