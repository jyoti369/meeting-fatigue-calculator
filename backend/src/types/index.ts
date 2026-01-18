export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  attendees?: Array<{ email: string }>;
  organizer?: { email: string };
  status: string;
}

export interface MeetingCategory {
  name: string;
  color: string;
  description: string;
}

export interface CategorizedMeeting extends CalendarEvent {
  category: string;
  duration: number; // minutes
  isRecurring: boolean;
  attendeeCount: number;
}

export interface MeetingStats {
  totalMeetings: number;
  totalHours: number;
  averageMeetingDuration: number;
  longestMeeting: number;
  meetingsByCategory: Record<string, number>;
  meetingsByDay: Record<string, number>;
  backToBackMeetings: number;
  recurringMeetings: number;
  externalMeetings: number;
}

export interface FatigueScore {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  badge: string;
  insights: string[];
  recommendations: string[];
}

export interface AnalysisResult {
  stats: MeetingStats;
  fatigueScore: FatigueScore;
  categorizedMeetings: CategorizedMeeting[];
  weeklyTrend: Array<{ week: string; hours: number }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const MEETING_CATEGORIES: Record<string, MeetingCategory> = {
  standup: {
    name: 'Standup',
    color: '#3b82f6',
    description: 'Daily team sync-ups and status updates',
  },
  one_on_one: {
    name: '1:1',
    color: '#8b5cf6',
    description: 'Individual check-ins with manager or direct reports',
  },
  planning: {
    name: 'Planning',
    color: '#06b6d4',
    description: 'Sprint planning, roadmap discussions, strategy sessions',
  },
  review: {
    name: 'Review/Demo',
    color: '#10b981',
    description: 'Sprint reviews, product demos, showcases',
  },
  brainstorm: {
    name: 'Brainstorm',
    color: '#f59e0b',
    description: 'Creative sessions, ideation, whiteboarding',
  },
  training: {
    name: 'Training',
    color: '#ec4899',
    description: 'Learning sessions, workshops, onboarding',
  },
  interview: {
    name: 'Interview',
    color: '#ef4444',
    description: 'Candidate interviews, screening calls',
  },
  all_hands: {
    name: 'All-Hands',
    color: '#6366f1',
    description: 'Company-wide meetings, town halls',
  },
  social: {
    name: 'Social',
    color: '#14b8a6',
    description: 'Team building, coffee chats, virtual hangouts',
  },
  other: {
    name: 'Other',
    color: '#64748b',
    description: 'Miscellaneous meetings',
  },
};
