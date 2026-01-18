import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { analyzeCalendar } from '../services/api';
import { AnalysisResult } from '../types';
import StatCard from '../components/StatCard';
import CategoryChart from '../components/CategoryChart';
import WeeklyTrendChart from '../components/WeeklyTrendChart';
import FatigueScoreCard from '../components/FatigueScoreCard';
import html2canvas from 'html2canvas';

function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reportCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/error?message=Missing access token');
      return;
    }

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const response = await analyzeCalendar(token, 30);

        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to analyze calendar');
        }

        setData(response.data);
      } catch (err: any) {
        console.error('Analysis failed:', err);
        setError(err.message || 'Failed to analyze your calendar');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [searchParams, navigate]);

  const downloadReportCard = async () => {
    if (!reportCardRef.current) return;

    try {
      const canvas = await html2canvas(reportCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = 'meeting-fatigue-report.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('Failed to generate report card image');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Analyzing your calendar...</p>
          <p className="text-sm text-gray-500 mt-2">This might take a minute</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold mb-2 text-red-600">Analysis Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { stats, fatigueScore, weeklyTrend, userInfo } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Meeting Fatigue Report
          </h1>
          {userInfo && (
            <p className="text-gray-600">
              Last 30 days for {userInfo.name} ({userInfo.email})
            </p>
          )}
        </div>

        {/* Report Card for Screenshot */}
        <div ref={reportCardRef} className="mb-8">
          <FatigueScoreCard fatigueScore={fatigueScore} stats={stats} />
        </div>

        {/* Download Button */}
        <div className="text-center mb-8">
          <button onClick={downloadReportCard} className="btn-primary">
            📸 Download Report Card
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Meetings"
            value={stats.totalMeetings}
            icon="📅"
            color="blue"
          />
          <StatCard
            title="Total Hours"
            value={`${stats.totalHours}h`}
            icon="⏰"
            color="purple"
          />
          <StatCard
            title="Avg Duration"
            value={`${Math.round(stats.averageMeetingDuration)}m`}
            icon="⌛"
            color="green"
          />
          <StatCard
            title="Back-to-Back"
            value={stats.backToBackMeetings}
            icon="🔥"
            color="red"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Meeting Categories</h3>
            <CategoryChart data={stats.meetingsByCategory} />
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Weekly Trend</h3>
            <WeeklyTrendChart data={weeklyTrend} />
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">📊 Key Insights</h3>
            <ul className="space-y-2">
              {fatigueScore.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">💡 Recommendations</h3>
            <ul className="space-y-2">
              {fatigueScore.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex justify-center gap-6 text-sm text-gray-500">
            <a href="/privacy-policy.html" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="/terms-of-service.html" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a
              href="https://github.com/jyoti369/meeting-fatigue-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              GitHub
            </a>
          </div>
          <button onClick={() => navigate('/')} className="btn-secondary">
            ← Analyze Another Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
