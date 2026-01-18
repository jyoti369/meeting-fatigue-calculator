import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import { CalendarEvent, MEETING_CATEGORIES } from '../types/index.js';

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    // Use gemini-2.5-flash-lite for stable API access
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite'
    });
  }

  async batchCategorizeMeetings(events: CalendarEvent[]): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    // If no events, return empty map
    if (events.length === 0) return results;

    // Filter out events that we can easily categorize with patterns first to save AI quota
    const needsAI: CalendarEvent[] = [];
    for (const event of events) {
      const fallback = this.getFastPatternMatch(event);
      if (fallback) {
        results.set(event.id, fallback);
      } else {
        needsAI.push(event);
      }
    }

    if (needsAI.length === 0) return results;

    // Process in larger batches (e.g., 25 at a time) but consolidated into ONE prompt
    const batchSize = 25;
    const categoriesList = Object.keys(MEETING_CATEGORIES).join(', ');

    for (let i = 0; i < needsAI.length; i += batchSize) {
      const batch = needsAI.slice(i, i + batchSize);
      const meetingList = batch.map(e => ({ id: e.id, title: e.summary, desc: e.description?.substring(0, 100) }));

      const prompt = `You are a meeting categorization expert. 
Categorize the following meetings into ONE of these categories: ${categoriesList}.

Meetings:
${JSON.stringify(meetingList, null, 2)}

Return a JSON object where keys are meeting IDs and values are the category names.
Example format: {"event_id_1": "standup", "event_id_2": "planning"}

Rules:
- "standup" = daily sync, daily standup, scrum, status update
- "one_on_one" = 1:1, check-in, catch up, manager sync
- "planning" = sprint planning, roadmap, strategy, OKRs
- "review" = demo, sprint review, showcase, retrospective
- "brainstorm" = brainstorming, ideation, creative session
- "training" = workshop, learning, onboarding
- "interview" = candidate interview, screening
- "all_hands" = company meeting, town hall
- "social" = coffee chat, team building, happy hour, lunch
- "other" = everything else`;

      try {
        const result = await this.model.generateContent(prompt);
        let responseText = result.response.text();

        // Clean the response - remove markdown code blocks and extra text
        responseText = responseText
          .replace(/^```json\n?/i, '')
          .replace(/^```\n?/, '')
          .replace(/\n?```$/, '')
          .trim();

        // Try to extract JSON object if there's extra text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          responseText = jsonMatch[0];
        }

        const categories = JSON.parse(responseText);

        for (const event of batch) {
          const category = categories[event.id] || 'other';
          results.set(event.id, MEETING_CATEGORIES[category] ? category : 'other');
        }
      } catch (error) {
        console.error('Batch AI categorization failed, falling back to patterns:', error);
        // Fallback for this batch
        for (const event of batch) {
          results.set(event.id, this.fallbackCategorization(event));
        }
      }

      // Small delay between API calls just in case
      if (i + batchSize < needsAI.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  private getFastPatternMatch(event: CalendarEvent): string | null {
    const title = (event.summary || '').toLowerCase();

    if (/(standup|scrum|daily sync)/i.test(title)) return 'standup';
    if (/(1:1|one on one|1-1)/i.test(title)) return 'one_on_one';
    if (/(sprint planning|okr planning)/i.test(title)) return 'planning';
    if (/(interview|screening)/i.test(title)) return 'interview';

    return null;
  }

  private fallbackCategorization(event: CalendarEvent): string {
    const title = (event.summary || '').toLowerCase();
    const description = (event.description || '').toLowerCase();
    const combined = `${title} ${description}`;

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
}
