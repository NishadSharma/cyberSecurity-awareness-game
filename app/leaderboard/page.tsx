'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Users, TrendingUp, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { io, Socket } from 'socket.io-client';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalScore: number;
  gamesPlayed: number;
  averageScore: number;
  bestScore: number;
  lastPlayed: string;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [gameType, setGameType] = useState('overall');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Initialize socket connection
    const newSocket = io(process.env.NODE_ENV === 'production' 
      ? 'https://your-api-domain.com' 
      : 'http://localhost:3001'
    );

    setSocket(newSocket);

    // Join leaderboard room
    newSocket.emit('join-leaderboard', gameType);

    // Listen for real-time updates
    newSocket.on('leaderboard-update', (data) => {
      console.log('Leaderboard update received:', data);
      loadLeaderboard(); // Refresh leaderboard data
    });

    return () => {
      newSocket.close();
    };
  }, [isAuthenticated, gameType]);

  useEffect(() => {
    if (isAuthenticated) {
      loadLeaderboard();
    }
  }, [isAuthenticated, gameType]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getLeaderboard(gameType, 20);
      
      if (response.success && response.data) {
        setLeaderboard(response.data.leaderboard);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30';
      default:
        return 'bg-gray-800/30 border-gray-700/50';
    }
  };

  const gameTypes = [
    { value: 'overall', label: 'Overall', icon: TrendingUp },
    { value: 'quiz', label: 'Quiz', icon: Users },
    { value: 'scenario', label: 'Scenarios', icon: Award },
    { value: 'password', label: 'Password', icon: Trophy },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
          <p className="text-gray-400">Please log in to view the leaderboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20">
              <Trophy className="h-12 w-12 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            See how you rank against other cybersecurity learners
          </p>
        </div>

        {/* Game Type Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {gameTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => setGameType(type.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  gameType === type.value
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-white">Loading leaderboard...</p>
          </div>
        ) : (
          <>
            {/* Current User Stats */}
            {user && (
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20 p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/20 rounded-full">
                    <Users className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Welcome back, {user.name}!</h3>
                    <p className="text-gray-300">
                      {leaderboard.find(entry => entry.userId === user._id) 
                        ? `You're ranked #${leaderboard.findIndex(entry => entry.userId === user._id) + 1} in ${gameType}`
                        : `Start playing to appear on the ${gameType} leaderboard!`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Table */}
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm overflow-hidden">
              <div className="p-6 border-b border-gray-700/50">
                <h2 className="text-2xl font-bold text-white capitalize">
                  {gameType} Leaderboard
                </h2>
                <p className="text-gray-400 mt-1">
                  Top performers in cybersecurity challenges
                </p>
              </div>

              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">No Data Yet</h3>
                  <p className="text-gray-500">Be the first to appear on this leaderboard!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700/50">
                  {leaderboard.map((entry, index) => {
                    const rank = index + 1;
                    const isCurrentUser = user && entry.userId === user._id;
                    
                    return (
                      <div
                        key={entry.userId}
                        className={`p-6 transition-all duration-200 hover:bg-gray-700/20 ${
                          isCurrentUser ? 'bg-cyan-500/5 border-l-4 border-cyan-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12">
                              {getRankIcon(rank)}
                            </div>
                            
                            <div>
                              <h3 className={`font-semibold ${
                                isCurrentUser ? 'text-cyan-300' : 'text-white'
                              }`}>
                                {entry.userName}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">
                                    You
                                  </span>
                                )}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {entry.gamesPlayed} games
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(entry.lastPlayed).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-cyan-400 mb-1">
                              {entry.totalScore.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-400">
                              Avg: {entry.averageScore} | Best: {entry.bestScore}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Real-time Update Indicator */}
            <div className="text-center mt-6">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm">Live updates enabled</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}