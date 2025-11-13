import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, TrendingUp, Palette, Play, Home, BarChart3 } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function Dashboard({ userId, userName, coneTestResults }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [userId]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/performance-tests/${userId}/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ totalTests: 0, averageScore: 0, averageTime: 0, improvement: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md text-center">
          <p className="text-xl text-gray-700 mb-4">Please create an account first</p>
          <button
            onClick={() => navigate('/')}
            className="btn-nature text-white font-bold px-8 py-3 rounded-full"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-nature-forest hover:text-nature-moss mb-4 transition-colors"
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          <h1 className="text-4xl font-bold text-nature-forest mb-2">
            Welcome back, {userName}! 🌿
          </h1>
          <p className="text-gray-600 text-lg">
            Track your color vision journey
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Cone Test Results Card */}
          <div className="glass-card rounded-3xl p-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-nature-leaf to-nature-moss p-3 rounded-xl">
                <Eye size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-nature-forest">
                Cone Sensitivity
              </h2>
            </div>

            {coneTestResults ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">L-Cone (Red)</span>
                    <span className="font-bold text-red-600">{coneTestResults.lCone}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill bg-red-500" 
                      style={{ width: `${coneTestResults.lCone}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">M-Cone (Green)</span>
                    <span className="font-bold text-green-600">{coneTestResults.mCone}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill bg-green-500" 
                      style={{ width: `${coneTestResults.mCone}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">S-Cone (Blue)</span>
                    <span className="font-bold text-blue-600">{coneTestResults.sCone}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill bg-blue-500" 
                      style={{ width: `${coneTestResults.sCone}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/cone-test')}
                  className="w-full mt-4 py-3 rounded-xl border-2 border-nature-leaf text-nature-forest font-semibold hover:bg-nature-leaf hover:text-white transition-all"
                >
                  Retake Test
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-6">
                  No cone test results yet. Take the test to get your personalized profile!
                </p>
                <button
                  onClick={() => navigate('/cone-test')}
                  className="btn-nature text-white font-bold px-8 py-3 rounded-full"
                  data-testid="take-cone-test-btn"
                >
                  Take Cone Test
                </button>
              </div>
            )}
          </div>

          {/* Performance Stats Card */}
          <div className="glass-card rounded-3xl p-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-nature-sky to-nature-ocean p-3 rounded-xl">
                <BarChart3 size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-nature-forest">
                Performance Stats
              </h2>
            </div>

            {!loading && stats ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-nature-sunrise/20 to-nature-sunset/20 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-nature-forest">{stats.totalTests}</p>
                    <p className="text-sm text-gray-600 mt-1">Tests Taken</p>
                  </div>
                  <div className="bg-gradient-to-br from-nature-leaf/20 to-nature-moss/20 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-nature-forest">{stats.averageScore}</p>
                    <p className="text-sm text-gray-600 mt-1">Avg Score</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-nature-sky/20 to-nature-ocean/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Improvement Rate</p>
                      <p className="text-2xl font-bold text-nature-forest">
                        {stats.improvement > 0 ? '+' : ''}{stats.improvement}%
                      </p>
                    </div>
                    <TrendingUp size={32} className={stats.improvement > 0 ? 'text-green-500' : 'text-gray-400'} />
                  </div>
                </div>

                {stats.averageTime > 0 && (
                  <div className="text-center text-gray-600">
                    <p className="text-sm">Average completion time</p>
                    <p className="text-xl font-bold text-nature-moss">{stats.averageTime}s</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="shimmer w-full h-40 rounded-xl"></div>
              </div>
            )}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/simulator')}
            className="glass-card rounded-2xl p-6 text-left card-hover group animate-fadeIn"
            style={{ animationDelay: '0.3s' }}
            data-testid="color-simulator-btn"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-14 h-14 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Palette size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-nature-forest mb-2">
              Color Simulator
            </h3>
            <p className="text-gray-600 text-sm">
              See how colors adapt to your vision profile
            </p>
          </button>

          <button
            onClick={() => navigate('/performance-test')}
            className="glass-card rounded-2xl p-6 text-left card-hover group animate-fadeIn"
            style={{ animationDelay: '0.4s' }}
            data-testid="performance-test-btn"
          >
            <div className="bg-gradient-to-br from-nature-sunrise to-nature-sunset w-14 h-14 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-nature-forest mb-2">
              Performance Test
            </h3>
            <p className="text-gray-600 text-sm">
              Fun games to test and improve your color perception
            </p>
          </button>

          <div className="glass-card rounded-2xl p-6 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <div className="bg-gradient-to-br from-nature-forest to-nature-leaf w-14 h-14 rounded-xl mb-4 flex items-center justify-center">
              <Eye size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-nature-forest mb-2">
              Your Progress
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Keep testing to see improvement over time
            </p>
            {stats && stats.totalTests > 0 && (
              <div className="text-xs text-nature-moss font-semibold">
                {stats.totalTests} test{stats.totalTests !== 1 ? 's' : ''} completed 🎉
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
