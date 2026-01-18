import { differenceInMinutes, format, startOfWeek, parseISO } from 'date-fns';
import {
  CalendarEvent,
  CategorizedMeeting,
  MeetingStats,
  FatigueScore,
  AnalysisResult,
} from '../types/index.js';

export class AnalyticsService {
  categorizeMeetings(
    events: CalendarEvent[],
    categoryMap: Map<string, string>,
    userEmail: string
  ): CategorizedMeeting[] {
    return events.map((event) => {
      const start = parseISO(event.start);
      const end = parseISO(event.end);
      const duration = differenceInMinutes(end, start);

      return {
        ...event,
        category: categoryMap.get(event.id) || 'other',
        duration,
        isRecurring: this.isRecurringMeeting(event),
        attendeeCount: event.attendees?.length || 1,
      };
    });
  }

  calculateStats(meetings: CategorizedMeeting[], userEmail: string): MeetingStats {
    const totalMeetings = meetings.length;
    const totalMinutes = meetings.reduce((sum, m) => sum + m.duration, 0);
    const totalHours = parseFloat((totalMinutes / 60).toFixed(1));

    const meetingsByCategory: Record<string, number> = {};
    const meetingsByDay: Record<string, number> = {};

    meetings.forEach((meeting) => {
      // Category stats
      meetingsByCategory[meeting.category] =
        (meetingsByCategory[meeting.category] || 0) + meeting.duration / 60;

      // Day stats
      const day = format(parseISO(meeting.start), 'EEEE');
      meetingsByDay[day] = (meetingsByDay[day] || 0) + 1;
    });

    // Calculate back-to-back meetings
    const sortedMeetings = [...meetings].sort(
      (a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime()
    );
    let backToBackCount = 0;
    for (let i = 0; i < sortedMeetings.length - 1; i++) {
      const currentEnd = parseISO(sortedMeetings[i].end);
      const nextStart = parseISO(sortedMeetings[i + 1].start);
      const gapMinutes = differenceInMinutes(nextStart, currentEnd);
      if (gapMinutes <= 5) {
        backToBackCount++;
      }
    }

    const recurringMeetings = meetings.filter((m) => m.isRecurring).length;
    const externalMeetings = meetings.filter(
      (m) => m.organizer?.email && m.organizer.email !== userEmail
    ).length;

    return {
      totalMeetings,
      totalHours,
      averageMeetingDuration: totalMeetings > 0 ? totalMinutes / totalMeetings : 0,
      longestMeeting: Math.max(...meetings.map((m) => m.duration), 0),
      meetingsByCategory,
      meetingsByDay,
      backToBackMeetings: backToBackCount,
      recurringMeetings,
      externalMeetings,
    };
  }

  calculateFatigueScore(stats: MeetingStats, meetings: CategorizedMeeting[]): FatigueScore {
    let score = 100;
    const insights: string[] = [];
    const recommendations: string[] = [];

    // Deduct points based on total meeting hours per week
    const avgWeeklyHours = (stats.totalHours / 30) * 7;
    if (avgWeeklyHours > 25) {
      score -= 30;
      insights.push(`You spend ${avgWeeklyHours.toFixed(1)} hours/week in meetings - that's insane!`);
      recommendations.push('Decline at least 30% of meetings - you really don\'t need to be there');
    } else if (avgWeeklyHours > 15) {
      score -= 20;
      insights.push(`${avgWeeklyHours.toFixed(1)} hours/week in meetings is above average`);
      recommendations.push('Try "No Meeting Wednesdays" to get deep work done');
    } else if (avgWeeklyHours > 10) {
      score -= 10;
      insights.push(`${avgWeeklyHours.toFixed(1)} hours/week in meetings - not terrible, but room to improve`);
    }

    // Back-to-back meetings penalty
    const backToBackPercentage = (stats.backToBackMeetings / stats.totalMeetings) * 100;
    if (backToBackPercentage > 50) {
      score -= 20;
      insights.push(`${backToBackPercentage.toFixed(0)}% of your meetings are back-to-back - no time to breathe!`);
      recommendations.push('Block 15-min buffers between meetings for sanity breaks');
    } else if (backToBackPercentage > 30) {
      score -= 10;
      insights.push(`${backToBackPercentage.toFixed(0)}% of meetings are back-to-back`);
      recommendations.push('Add calendar buffers to prevent burnout');
    }

    // Long meetings penalty
    const avgDuration = stats.averageMeetingDuration;
    if (avgDuration > 60) {
      score -= 15;
      insights.push(`Average meeting is ${avgDuration.toFixed(0)} minutes - too long!`);
      recommendations.push('Challenge every meeting over 45 minutes - most can be shorter');
    } else if (avgDuration > 45) {
      score -= 5;
      insights.push(`Average meeting duration: ${avgDuration.toFixed(0)} minutes`);
    }

    // Recurring meetings check
    const recurringPercentage = (stats.recurringMeetings / stats.totalMeetings) * 100;
    if (recurringPercentage > 60) {
      score -= 10;
      insights.push(`${recurringPercentage.toFixed(0)}% are recurring - some are probably dead weight`);
      recommendations.push('Audit recurring meetings quarterly - cancel the zombies');
    }

    // External meetings
    const externalPercentage = (stats.externalMeetings / stats.totalMeetings) * 100;
    if (externalPercentage > 70) {
      insights.push(`${externalPercentage.toFixed(0)}% of meetings organized by others - you're reactive, not proactive`);
      recommendations.push('Block 2-hour "focus time" blocks daily to own your calendar');
    }

    // Category-specific insights
    const categoryHours = stats.meetingsByCategory;
    if (categoryHours.standup && categoryHours.standup > 10) {
      insights.push(`Spending ${categoryHours.standup.toFixed(1)} hours/month in standups - that's a lot of status updates`);
      recommendations.push('Try async standups in Slack/Teams instead');
    }

    if (categoryHours.all_hands && categoryHours.all_hands > 5) {
      insights.push(`${categoryHours.all_hands.toFixed(1)} hours in all-hands meetings - hope they're worth it`);
    }

    // Ensure score stays within bounds
    score = Math.max(0, Math.min(100, score));

    // Determine grade and badge
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    let badge: string;

    if (score >= 90) {
      grade = 'A';
      badge = '🏆 Calendar Master - You actually own your time!';
    } else if (score >= 80) {
      grade = 'B';
      badge = '✅ Solid - Minor tweaks needed';
    } else if (score >= 70) {
      grade = 'C';
      badge = '⚠️ Meeting Overload - Time to push back';
    } else if (score >= 60) {
      grade = 'D';
      badge = '🔥 Calendar Chaos - Your schedule owns you';
    } else {
      grade = 'F';
      badge = '💀 Meeting Hell - Escape while you can!';
    }

    // Add some positive insights if score is good
    if (score >= 80) {
      insights.push('You have good control over your calendar!');
    }

    return {
      score: Math.round(score),
      grade,
      badge,
      insights,
      recommendations,
    };
  }

  calculateWeeklyTrend(meetings: CategorizedMeeting[]): Array<{ week: string; hours: number }> {
    const weekMap = new Map<string, number>();

    meetings.forEach((meeting) => {
      const weekStart = startOfWeek(parseISO(meeting.start));
      const weekKey = format(weekStart, 'MMM dd');
      const hours = meeting.duration / 60;

      weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + hours);
    });

    return Array.from(weekMap.entries())
      .map(([week, hours]) => ({ week, hours: parseFloat(hours.toFixed(1)) }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-4); // Last 4 weeks
  }

  analyze(
    events: CalendarEvent[],
    categoryMap: Map<string, string>,
    userEmail: string
  ): AnalysisResult {
    const categorizedMeetings = this.categorizeMeetings(events, categoryMap, userEmail);
    const stats = this.calculateStats(categorizedMeetings, userEmail);
    const fatigueScore = this.calculateFatigueScore(stats, categorizedMeetings);
    const weeklyTrend = this.calculateWeeklyTrend(categorizedMeetings);

    return {
      stats,
      fatigueScore,
      categorizedMeetings,
      weeklyTrend,
    };
  }

  private isRecurringMeeting(event: CalendarEvent): boolean {
    // Simple heuristic: check if summary contains common recurring patterns
    const summary = (event.summary || '').toLowerCase();
    return (
      /(daily|weekly|bi.?weekly|monthly|recurring|standup|sync)/i.test(summary) ||
      (event.attendees?.length || 0) === event.attendees?.length // More sophisticated check needed
    );
  }
}
