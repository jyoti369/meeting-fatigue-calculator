# Deployment Guide

## Step 1: Deploy Frontend to Vercel ✅ (You're doing this now!)

```bash
cd frontend
vercel --prod
```

**Vercel Questions:**
- Scope: Debojyoti Mandal's projects
- Project name: meeting-fatigue-calculator
- Directory: `./frontend`
- Settings: Accept defaults (Vite auto-detected)

**Result:** You'll get a URL like `https://meeting-fatigue-calculator.vercel.app`

---

## Step 2: Deploy Backend to Render

### Option A: Deploy via Render Dashboard (Recommended)

1. **Push code to GitHub first:**
   ```bash
   cd /Users/debojyoti.mandal/personal/meeting-fatigue-calculator
   git init
   git add .
   git commit -m "Initial commit: Meeting Fatigue Calculator"
   git branch -M main
   git remote add origin https://github.com/jyoti369/meeting-fatigue-calculator.git
   git push -u origin main
   ```

2. **Connect to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select the `meeting-fatigue-calculator` repository
   - Configure:
     - **Name**: `meeting-fatigue-api`
     - **Region**: Oregon (US West)
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Runtime**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Add Environment Variables in Render:**
   Click "Environment" tab and add:
   ```
   NODE_ENV=production
   PORT=3001
   GOOGLE_CLIENT_ID=<your_google_client_id>
   GOOGLE_CLIENT_SECRET=<your_google_client_secret>
   GOOGLE_REDIRECT_URI=https://meeting-fatigue-api.onrender.com/auth/google/callback
   GEMINI_API_KEY=<your_gemini_api_key>
   FRONTEND_URL=https://meeting-fatigue-calculator.vercel.app
   ```

4. **Deploy**: Click "Create Web Service"

**Result:** You'll get a URL like `https://meeting-fatigue-api.onrender.com`

---

## Step 3: Update Environment Variables

### Update Vercel (Frontend)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → Settings → Environment Variables
3. Add:
   - Key: `VITE_API_URL`
   - Value: `https://meeting-fatigue-api.onrender.com`
4. Redeploy frontend

### Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Click your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", add:
   - `https://meeting-fatigue-api.onrender.com/auth/google/callback`
5. Click "Save"

---

## Step 4: Test Production Deployment

1. Visit your Vercel URL: `https://meeting-fatigue-calculator.vercel.app`
2. Click "Analyze with Google Calendar"
3. Complete OAuth flow
4. Verify analysis works

---

## Step 5: Update OAuth Consent Screen for Verification

Now that you have live URLs, update the OAuth consent screen:

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → OAuth consent screen
2. Update:
   - **App homepage**: `https://meeting-fatigue-calculator.vercel.app`
   - **Privacy policy**: `https://meeting-fatigue-calculator.vercel.app/privacy-policy.html`
   - **Terms of service**: `https://meeting-fatigue-calculator.vercel.app/terms-of-service.html`
   - **Authorized domains**: Add `vercel.app` and `onrender.com`

---

## Troubleshooting

### Frontend Issues

**"Failed to fetch from API"**
- Check `VITE_API_URL` environment variable in Vercel
- Ensure backend is running on Render
- Check CORS settings in backend

**Build fails**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`

### Backend Issues

**"Application error"**
- Check Render logs: Dashboard → Logs
- Verify all environment variables are set
- Ensure `GOOGLE_REDIRECT_URI` matches Render URL

**"OAuth error"**
- Verify redirect URI in Google Cloud Console matches Render URL exactly
- Check `FRONTEND_URL` environment variable

**"AI categorization failed"**
- Verify `GEMINI_API_KEY` is correct
- Check Gemini API quota limits

### OAuth Issues

**"redirect_uri_mismatch"**
- Ensure redirect URI in Google Cloud Console includes:
  - `http://localhost:3001/auth/google/callback` (dev)
  - `https://meeting-fatigue-api.onrender.com/auth/google/callback` (prod)

**"Access blocked: meeting has not completed verification"**
- Add yourself as a test user (OAuth consent screen → Test users)
- Or wait for Google verification to complete

---

## Cost Breakdown (All FREE!)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | $0/month |
| Render | Free | $0/month (750 hours/month) |
| Google Calendar API | Free tier | $0 (100k requests/day) |
| Google Gemini API | Free tier | $0 (60 requests/minute) |

**Total monthly cost: $0** 🎉

---

## Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] Environment variables configured on both platforms
- [ ] OAuth redirect URIs updated in Google Cloud
- [ ] Production app tested end-to-end
- [ ] OAuth consent screen updated with live URLs
- [ ] Privacy policy accessible at `/privacy-policy.html`
- [ ] Terms of service accessible at `/terms-of-service.html`
- [ ] Ready to submit for Google verification!

---

## Next Steps After Deployment

1. **Test thoroughly** with your account (as test user)
2. **Create demo video** showing the full flow
3. **Submit for Google verification** (see GOOGLE_VERIFICATION.md)
4. **Share on social media** to get early users
5. **Monitor usage** in Google Cloud Console

---

## Useful Commands

### Redeploy Frontend
```bash
cd frontend
vercel --prod
```

### View Render Logs
```bash
# In Render dashboard → your service → Logs tab
# Or use Render CLI:
render logs meeting-fatigue-api
```

### Check Backend Health
```bash
curl https://meeting-fatigue-api.onrender.com/health
```

---

## Support

If you run into issues:
- Frontend: Check Vercel deployment logs
- Backend: Check Render logs
- OAuth: Verify redirect URIs match exactly
- API: Check Google Cloud Console quotas

Good luck with deployment! 🚀
