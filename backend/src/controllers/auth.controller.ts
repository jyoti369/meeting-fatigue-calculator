import { Request, Response } from 'express';
import { CalendarService } from '../services/calendar.service.js';
import { config } from '../config/env.js';

const calendarService = new CalendarService();

export const initiateGoogleAuth = (req: Request, res: Response) => {
  const authUrl = calendarService.getAuthUrl();
  return res.json({ authUrl });
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    return res.redirect(`${config.frontendUrl}/error?message=Missing authorization code`);
  }

  try {
    const tokens = await calendarService.getTokensFromCode(code);

    // In production, you'd store tokens securely (encrypted database, Redis, etc.)
    // For MVP, we'll pass the access token to the frontend via redirect
    const accessToken = tokens.access_token;

    return res.redirect(`${config.frontendUrl}/dashboard?token=${accessToken}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.redirect(`${config.frontendUrl}/error?message=Authentication failed`);
  }
};
