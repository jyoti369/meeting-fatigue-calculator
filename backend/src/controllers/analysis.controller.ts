import { Request, Response } from 'express';
import { CalendarService } from '../services/calendar.service.js';
import { AIService } from '../services/ai.service.js';
import { AnalyticsService } from '../services/analytics.service.js';
import { ApiResponse, AnalysisResult } from '../types/index.js';

const calendarService = new CalendarService();
const aiService = new AIService();
const analyticsService = new AnalyticsService();

export const analyzeCalendar = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Missing or invalid authorization token',
    } as ApiResponse<null>);
  }

  const accessToken = authHeader.substring(7);
  const days = parseInt(req.query.days as string) || 30;

  try {
    // Fetch user info
    const userInfo = await calendarService.getUserInfo(accessToken);

    // Fetch calendar events
    console.log(`Fetching calendar events for last ${days} days...`);
    const events = await calendarService.getCalendarEvents(accessToken, days);

    if (events.length === 0) {
      return res.json({
        success: true,
        message: 'No meetings found in the specified period',
        data: {
          stats: {
            totalMeetings: 0,
            totalHours: 0,
            averageMeetingDuration: 0,
            longestMeeting: 0,
            meetingsByCategory: {},
            meetingsByDay: {},
            backToBackMeetings: 0,
            recurringMeetings: 0,
            externalMeetings: 0,
          },
          fatigueScore: {
            score: 100,
            grade: 'A',
            badge: '🏆 Calendar Master - You actually own your time!',
            insights: ['No meetings found - ultimate productivity!'],
            recommendations: ['Keep it this way!'],
          },
          categorizedMeetings: [],
          weeklyTrend: [],
        } as AnalysisResult,
      } as ApiResponse<AnalysisResult>);
    }

    console.log(`Found ${events.length} meetings. Categorizing...`);

    // Categorize meetings using AI
    const categoryMap = await aiService.batchCategorizeMeetings(events);

    console.log('Analyzing meeting patterns...');

    // Analyze and calculate fatigue score
    const analysis = analyticsService.analyze(events, categoryMap, userInfo.email || '');

    res.json({
      success: true,
      message: `Analyzed ${events.length} meetings from the last ${days} days`,
      data: {
        ...analysis,
        userInfo: {
          name: userInfo.name,
          email: userInfo.email,
        },
      },
    } as ApiResponse<AnalysisResult & { userInfo: typeof userInfo }>);
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze calendar',
    } as ApiResponse<null>);
  }
};
