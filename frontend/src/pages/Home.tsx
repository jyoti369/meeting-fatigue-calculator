import { useState } from 'react';
import { getAuthUrl } from '../services/api';

function Home() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
      alert('Failed to initiate login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Meeting Fatigue Calculator
            </h1>
            <p className="text-2xl text-gray-600 mb-2">
              Get a brutally honest report card on your meeting waste
            </p>
            <p className="text-lg text-gray-500">
              Upload your calendar. See the damage. Fix your life.
            </p>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="stat-card">
              <div className="text-4xl font-bold text-blue-600 mb-2">25.6</div>
              <div className="text-gray-600">Average meetings per week</div>
            </div>
            <div className="stat-card">
              <div className="text-4xl font-bold text-purple-600 mb-2">70%</div>
              <div className="text-gray-600">Meetings rated "unproductive"</div>
            </div>
            <div className="stat-card">
              <div className="text-4xl font-bold text-red-600 mb-2">12h</div>
              <div className="text-gray-600">Wasted per week (avg)</div>
            </div>
          </div>

          {/* CTA */}
          <div className="mb-12">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="btn-primary text-xl px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Connecting...
                </span>
              ) : (
                <>
                  <svg className="inline-block w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Analyze with Google Calendar
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-4">
              We only read your calendar. No data is stored. Ever.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="card text-left">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Automatically categorizes your meetings: standups, 1:1s, planning, brainstorms, and
                more
              </p>
            </div>
            <div className="card text-left">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-semibold mb-2">Fatigue Score</h3>
              <p className="text-gray-600">
                Get graded on your calendar health with actionable recommendations
              </p>
            </div>
            <div className="card text-left">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="text-xl font-semibold mb-2">Shareable Report Card</h3>
              <p className="text-gray-600">
                Generate social media-ready images to share your meeting misery
              </p>
            </div>
            <div className="card text-left">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-600">
                Zero data storage. Analysis happens in real-time and disappears forever
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-gray-500 text-sm">
            <p>
              Built by{' '}
              <a
                href="https://github.com/jyoti369"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Debojyoti Mandal
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
