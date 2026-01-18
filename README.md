# Meeting Fatigue Calculator

Upload your calendar, get a brutally honest report card on your meeting waste.

## Features

- **OAuth with Google Calendar** - Secure login, no data stored
- **AI-Powered Analysis** - Categorize meetings automatically (standups, 1:1s, planning, etc.)
- **Fatigue Score** - Get your meeting waste score with funny badges
- **Visual Dashboard** - Charts showing time breakdown, meeting types, trends
- **Shareable Report Card** - Generate social media-ready images
- **Privacy First** - No data persistence, analyze on-the-fly

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- Google Calendar API (OAuth 2.0)
- Google Gemini AI (meeting categorization)
- Canvas (report card generation)

### Frontend
- React + Vite + TypeScript
- TailwindCSS
- Recharts (data visualization)
- React Router

### Deployment
- Frontend: Vercel
- Backend: Render (free tier)

## Quick Start

### Prerequisites
- Node.js >= 18
- Google Cloud Project with Calendar API enabled
- Google Gemini API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
meeting-fatigue-calculator/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & API configs
│   │   ├── services/        # Google Calendar, AI, Analytics
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # API endpoints
│   │   ├── types/           # TypeScript interfaces
│   │   └── utils/           # Helpers
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Helper functions
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/google` | Initiate Google OAuth flow |
| GET | `/auth/google/callback` | OAuth callback handler |
| GET | `/api/analyze` | Analyze calendar (requires auth) |
| GET | `/api/report-card` | Generate shareable image |

## Development Roadmap

- [x] Project scaffolding
- [ ] Google OAuth implementation
- [ ] Calendar API integration
- [ ] AI meeting categorization
- [ ] Analytics engine
- [ ] Frontend dashboard
- [ ] Report card generator
- [ ] Deployment setup

## License

MIT

## Author

Debojyoti Mandal
