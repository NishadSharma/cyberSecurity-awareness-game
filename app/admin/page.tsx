'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, BookOpen, Target, Trophy, TrendingUp, AlertTriangle,
  Calendar, Clock, Award, Shield
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalQuestions: number;
    totalScenarios: number;
    totalGameSessions: number;
  };
  scoresByCategory: Array<{
    _id: string;
    averageScore: number;
    totalSessions: number;
  }>;
  missedQuestions: Array<{
    _id: string;
    question: string;
    category: string;
    difficulty: string;
    missedCount: number;
  }>;
  recentSessions: Array<{
    _id: string;
    userId: { name: string };
    gameType: string;
    score: number;
    createdAt: string;
  }>;
  dailyActivity: Array<{
    date: string;
    sessions: number;
    uniqueUsers: number;
  }>;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user && user.role !== 'admin') {
      router.push('/');
      return;
    }

    loadAnalytics();
  }, [isAuthenticated, user]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAnalytics();
      
      if (response.success && response.data) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage content and view analytics</p>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={() => router.push('/admin/questions')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
            >
              Manage Questions
            </button>
            <button
              onClick={() => router.push('/admin/scenarios')}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-300"
            >
              Manage Scenarios
            </button>
            <button
              onClick={() => router.push('/admin/users')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
            >
              Manage Users
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-cyan-400">{analytics.overview.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-cyan-400" />
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Questions</p>
                <p className="text-3xl font-bold text-green-400">{analytics.overview.totalQuestions}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Scenarios</p>
                <p className="text-3xl font-bold text-amber-400">{analytics.overview.totalScenarios}</p>
              </div>
              <Target className="h-8 w-8 text-amber-400" />
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Game Sessions</p>
                <p className="text-3xl font-bold text-purple-400">{analytics.overview.totalGameSessions}</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Scores by Category */}
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
            <h3 className="text-xl font-bold text-white mb-4">Average Scores by Game Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.scoresByCategory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="_id" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="averageScore" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Activity */}
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
            <h3 className="text-xl font-bold text-white mb-4">Daily Activity (Last 30 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="sessions" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="uniqueUsers" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Missed Questions */}
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Most Missed Questions
            </h3>
            <div className="space-y-3">
              {analytics.missedQuestions.slice(0, 5).map((item, index) => (
                <div key={item._id} className="bg-gray-900/30 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm mb-1">
                        {item.question.length > 60 ? `${item.question.substring(0, 60)}...` : item.question}
                      </p>
                      <div className="flex gap-2">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs">
                          {item.category}
                        </span>
                        <span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded text-xs">
                          {item.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-red-400 font-bold">{item.missedCount}</div>
                      <div className="text-gray-400 text-xs">misses</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400" />
              Recent Game Sessions
            </h3>
            <div className="space-y-3">
              {analytics.recentSessions.map((session) => (
                <div key={session._id} className="bg-gray-900/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{session.userId.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="capitalize">{session.gameType}</span>
                        <span>•</span>
                        <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 font-bold">{session.score}</div>
                      <div className="text-gray-400 text-xs">points</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}