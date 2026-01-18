import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { CalendarEvent, MEETING_CATEGORIES } from '../types/index.js';

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  async categorizeMeeting(event: CalendarEvent): Promise<string> {
    const categories = Object.keys(MEETING_CATEGORIES).join(', ');

    const prompt = `You are a meeting categorization expert. Categorize this meeting into ONE of these categories: ${categories}.

Meeting Title: ${event.summary}
Description: ${event.description || 'N/A'}
Number of Attendees: ${event.attendees?.length || 1}

Return ONLY the category name (lowercase, using underscores). Examples: "standup", "one_on_one", "planning", "review", "brainstorm", "training", "interview", "all_hands", "social", "other"

Rules:
- "standup" = daily sync, daily standup, scrum, status update
- "one_on_one" = 1:1, check-in, catch up with 1-2 people, manager sync
- "planning" = sprint planning, roadmap, strategy, OKRs, quarterly planning
- "review" = demo, sprint review, showcase, retrospective
- "brainstorm" = brainstorming, ideation, creative session, whiteboard
- "training" = workshop, learning, onboarding, training session
- "interview" = candidate interview, screening, hiring
- "all_hands" = company meeting, town hall, all hands
- "social" = coffee chat, team building, happy hour, lunch
- "other" = everything else

Category:`;

    try {
      const result = await this.model.generateContent(prompt);
      const category = result.response.text().trim().toLowerCase();

      // Validate category
      if (MEETING_CATEGORIES[category]) {
        return category;
      }

      // Fallback to simple pattern matching
      return this.fallbackCategorization(event);
    } catch (error) {
      console.error('AI categorization failed:', error);
      return this.fallbackCategorization(event);
    }
  }

  private fallbackCategorization(event: CalendarEvent): string {
    const title = (event.summary || '').toLowerCase();
    const description = (event.description || '').toLowerCase();
    const combined = `${title} ${description}`;

    // Pattern matching
    if (/(standup|daily|scrum|sync)/i.test(combined)) return 'standup';
    if (/(1:1|one on one|1-1|check.?in)/i.test(combined)) return 'one_on_one';
    if (/(planning|sprint|roadmap|strategy)/i.test(combined)) return 'planning';
    if (/(review|demo|retro|retrospective|showcase)/i.test(combined)) return 'review';
    if (/(brainstorm|ideation|whiteboard)/i.test(combined)) return 'brainstorm';
    if (/(training|workshop|learning|onboard)/i.test(combined)) return 'training';
    if (/(interview|screening|candidate)/i.test(combined)) return 'interview';
    if (/(all.?hands|town.?hall|company)/i.test(combined)) return 'all_hands';
    if (/(coffee|social|lunch|happy.?hour|team.?building)/i.test(combined)) return 'social';

    return 'other';
  }

  async batchCategorizeMeetings(events: CalendarEvent[]): Promise<Map<string, string>> {
    const categories = new Map<string, string>();

    // Process in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      const promises = batch.map(async (event) => {
        const category = await this.categorizeMeeting(event);
        categories.set(event.id, category);
      });

      await Promise.all(promises);

      // Small delay between batches
      if (i + batchSize < events.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return categories;
  }
}
