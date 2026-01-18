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
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  badge: string;
  insights: string[];
  recommendations: string[];
}

export interface AnalysisResult {
  stats: MeetingStats;
  fatigueScore: FatigueScore;
  categorizedMeetings: any[];
  weeklyTrend: Array<{ week: string; hours: number }>;
  userInfo?: {
    name: string;
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
