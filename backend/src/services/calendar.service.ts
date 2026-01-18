import { google } from 'googleapis';
import { config } from '../config/env.js';
import { CalendarEvent } from '../types/index.js';

export class CalendarService {
  private oauth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectUri
    );
  }

  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    });
  }

  async getTokensFromCode(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  async getCalendarEvents(accessToken: string, days: number = 30): Promise<CalendarEvent[]> {
    this.oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);

    try {
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: pastDate.toISOString(),
        timeMax: now.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 2500,
      });

      const events = response.data.items || [];

      return events
        .filter((event) => {
          // Filter out all-day events and events without start/end times
          return (
            event.start?.dateTime &&
            event.end?.dateTime &&
            event.status !== 'cancelled'
          );
        })
        .map((event) => ({
          id: event.id || '',
          summary: event.summary || 'No Title',
          description: event.description || undefined,
          start: event.start!.dateTime!,
          end: event.end!.dateTime!,
          attendees: event.attendees?.map((a) => ({ email: a.email || '' })),
          organizer: event.organizer?.email ? { email: event.organizer.email } : undefined,
          status: event.status || 'confirmed',
        }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  async getUserInfo(accessToken: string) {
    this.oauth2Client.setCredentials({ access_token: accessToken });

    const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });

    try {
      const response = await oauth2.userinfo.get();
      return {
        email: response.data.email,
        name: response.data.name,
        picture: response.data.picture,
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error('Failed to fetch user info');
    }
  }
}
