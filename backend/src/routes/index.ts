import express from 'express';
import { initiateGoogleAuth, handleGoogleCallback } from '../controllers/auth.controller.js';
import { analyzeCalendar } from '../controllers/analysis.controller.js';

const router = express.Router();

// Auth routes
router.get('/auth/google', initiateGoogleAuth);
router.get('/auth/google/callback', handleGoogleCallback);

// Analysis routes
router.get('/api/analyze', analyzeCalendar);

// Health check
router.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ success: true, message: 'Meeting Fatigue Calculator API is running' });
});

export default router;
