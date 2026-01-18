# Google OAuth Verification Guide

This guide walks you through completing the OAuth consent screen to make your app available to all users (not just test users).

## Step 1: Access OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** > **OAuth consent screen**

## Step 2: Configure App Information

### Basic Information

Fill in these required fields:

| Field | Value |
|-------|-------|
| **App name** | Meeting Fatigue Calculator |
| **User support email** | debojyotimandal369@gmail.com |
| **App logo** | Upload the logo from `frontend/public/calendar-icon.svg` (512x512px) |
| **Application home page** | `https://your-app.vercel.app` (after deployment) |
| **Application privacy policy link** | `https://your-app.vercel.app/privacy-policy.html` |
| **Application terms of service link** | `https://your-app.vercel.app/terms-of-service.html` |
| **Authorized domains** | `vercel.app` and `onrender.com` |
| **Developer contact email** | debojyotimandal369@gmail.com |

### App Description

```
Meeting Fatigue Calculator analyzes your Google Calendar to provide insights about your meeting patterns. Get a brutally honest report card showing how much time you spend in meetings, identify productivity killers like back-to-back meetings, and receive personalized recommendations to improve your calendar health.

Key features:
• AI-powered meeting categorization
• Meeting fatigue score (0-100)
• Visual analytics and trends
• Shareable report cards
• Privacy-first: no data storage
```

## Step 3: Configure Scopes

Click **"Add or Remove Scopes"** and add these scopes:

### Required Scopes:

1. **Calendar (Read-only)**
   - Scope: `https://www.googleapis.com/auth/calendar.readonly`
   - Justification: "Read calendar events to analyze meeting patterns and calculate fatigue scores"

2. **User Email**
   - Scope: `https://www.googleapis.com/auth/userinfo.email`
   - Justification: "Identify the user and personalize their report"

3. **User Profile**
   - Scope: `https://www.googleapis.com/auth/userinfo.profile`
   - Justification: "Display user name on personalized report card"

### Scope Justifications for Google Review:

When Google asks "Why does your app need these scopes?", answer:

```
Calendar Read-Only Access:
Our app analyzes calendar events from the last 30 days to:
- Calculate total meeting hours and patterns
- Categorize meeting types (standups, 1:1s, planning, etc.)
- Identify back-to-back meetings and time wasters
- Generate fatigue scores and personalized recommendations

The app requires read-only access to provide this analysis. We do NOT store any calendar data - all processing happens in real-time and data is immediately discarded after analysis.

User Email & Profile:
We use email and name to:
- Identify the user in their personalized report
- Display their name on the generated report card
- Distinguish between meetings organized by the user vs external meetings

This information is only used for personalization and is not stored permanently.
```

## Step 4: Verification Documentation

Google will request additional documentation. Prepare these:

### 1. YouTube Video (Required for Sensitive Scopes)

Create a 2-3 minute video showing:
- App homepage and login flow
- OAuth consent screen with all requested permissions
- Calendar data being analyzed (use test account)
- Results dashboard with insights and recommendations
- Privacy features (no data storage message)
- How to revoke access

**Tips:**
- Use screen recording software (QuickTime, OBS, Loom)
- Show mouse clicks clearly
- Add voiceover explaining what you're doing
- Upload as unlisted YouTube video
- Provide link in verification form

### 2. Privacy Policy URL

Already created: `https://your-app.vercel.app/privacy-policy.html`

Ensure it covers:
- ✅ What data is collected
- ✅ How data is used
- ✅ That data is NOT stored
- ✅ Google API Services User Data Policy compliance
- ✅ User rights and data deletion
- ✅ Contact information

### 3. Terms of Service URL

Already created: `https://your-app.vercel.app/terms-of-service.html`

### 4. Domain Verification

1. Go to **Google Search Console**: https://search.google.com/search-console
2. Add property: `your-app.vercel.app`
3. Verify ownership (Vercel makes this easy - add TXT record or HTML file)

## Step 5: Submit for Verification

1. Click **"Submit for Verification"**
2. Fill out the verification questionnaire:

### Common Questions and Answers:

**Q: How does your app use calendar data?**
```
Our app performs read-only analysis of calendar events to generate meeting insights.
We categorize meetings, calculate statistics (total hours, back-to-back meetings),
and provide a fatigue score with recommendations. No data is stored - analysis
happens in real-time and data is discarded immediately.
```

**Q: Will you share user data with third parties?**
```
No. We do not sell or share user data with third parties. Meeting titles are sent
to Google Gemini AI for categorization purposes only, and are not stored by us or
by Google Gemini.
```

**Q: How long do you retain user data?**
```
We do not retain user data. Calendar events are processed in-memory during analysis
and immediately discarded. OAuth tokens are session-based and expire after use.
```

**Q: How do users delete their data?**
```
Since we don't store data, there's nothing to delete. Users can revoke app access
at any time through Google Account Permissions, which immediately terminates our
access to their calendar.
```

## Step 6: Google Review Timeline

- **Initial Review:** 3-7 business days
- **Additional Info Requested:** 1-3 days to respond
- **Final Approval:** 1-2 weeks total

## Step 7: While Waiting for Approval

Your app will remain in "Testing" mode. You can:
- Add up to 100 test users
- Use the app fully with test users
- Continue development
- Deploy to production (works for test users)

## Step 8: After Approval

Once approved:
- Remove "In Testing" status
- Publish to all users
- Monitor usage in Google Cloud Console
- Stay compliant with Google's policies

## Troubleshooting Common Rejections

### "Insufficient Privacy Policy"
✅ **Fix:** Ensure privacy policy explicitly mentions:
- Google Calendar API usage
- Compliance with Google API Services User Data Policy
- Data retention policy (none in our case)

### "Need More Justification for Scopes"
✅ **Fix:** Be specific about WHY you need calendar access:
- "To calculate meeting statistics" ✅
- "To improve user experience" ❌ (too vague)

### "Domain Verification Failed"
✅ **Fix:** Verify domain in Google Search Console before submitting

### "Video Doesn't Show Permissions Clearly"
✅ **Fix:** Zoom in on OAuth consent screen, show all checkboxes

## Cost

**Everything is FREE:**
- OAuth consent screen configuration: Free
- Verification process: Free
- Google Calendar API: Free (100k requests/day)
- Gemini API: Free tier (60 requests/minute)

## Important Reminders

1. **Deploy first, then verify** - You need live URLs for privacy policy and app homepage
2. **Use production URLs** - Don't use localhost in OAuth consent screen
3. **Keep policies updated** - If you change how data is used, update privacy policy
4. **Monitor quota** - Google Calendar API has generous free limits, but monitor usage

## Need Help?

If verification is rejected:
1. Read the rejection reason carefully
2. Address ALL points mentioned
3. Update relevant sections
4. Resubmit with detailed response

Google's verification team is helpful - respond professionally and provide all requested information.

---

## Quick Deployment Checklist Before Verification

- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Render
- [ ] Update OAuth redirect URIs with production URLs
- [ ] Test OAuth flow on production
- [ ] Verify privacy policy and TOS are accessible
- [ ] Create demo video
- [ ] Verify domain in Google Search Console
- [ ] Add production URLs to OAuth consent screen
- [ ] Submit for verification

Good luck! 🚀
