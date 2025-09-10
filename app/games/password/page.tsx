'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle, XCircle, AlertTriangle, Shield, RotateCcw } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

interface PasswordResult {
  score: number;
  strength: string;
  feedback: {
    warning: string;
    suggestions: string[];
  };
  crackTime: string;
}

export default function PasswordGame() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<PasswordResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated]);

  const evaluatePassword = async () => {
    if (!password.trim()) return;

    try {
      setLoading(true);
      const response = await apiClient.evaluatePassword(password);
      
      if (response.success && response.data) {
        setResult(response.data);
        setAttempts(attempts + 1);
        setTotalScore(totalScore + response.data.score);
        setBestScore(Math.max(bestScore, response.data.score));
      }
    } catch (error) {
      console.error('Failed to evaluate password:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setPassword('');
    setResult(null);
    setAttempts(0);
    setTotalScore(0);
    setBestScore(0);
  };

  const getStrengthColor = (strength: string) => {
    switch (strength.toLowerCase()) {
      case 'very weak':
        return 'text-red-400';
      case 'weak':
        return 'text-orange-400';
      case 'fair':
        return 'text-yellow-400';
      case 'good':
        return 'text-blue-400';
      case 'strong':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength.toLowerCase()) {
      case 'very weak':
      case 'weak':
        return <XCircle className="h-6 w-6 text-red-400" />;
      case 'fair':
        return <AlertTriangle className="h-6 w-6 text-yellow-400" />;
      case 'good':
      case 'strong':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      default:
        return <Shield className="h-6 w-6 text-gray-400" />;
    }
  };

  const passwordTips = [
    "Use at least 12 characters",
    "Mix uppercase and lowercase letters",
    "Include numbers and special symbols",
    "Avoid dictionary words",
    "Don't use personal information",
    "Consider using a passphrase",
    "Avoid common patterns (123, abc, qwerty)",
    "Use unique passwords for each account"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/20">
              <Lock className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Password Strength Challenge</h1>
          <p className="text-gray-300">Create strong passwords and learn security best practices</p>
          
          {/* Stats */}
          {attempts > 0 && (
            <div className="flex justify-center gap-4 mt-4">
              <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 px-4 py-2">
                <span className="text-gray-400 text-sm">Attempts: </span>
                <span className="text-cyan-400 font-bold">{attempts}</span>
              </div>
              <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 px-4 py-2">
                <span className="text-gray-400 text-sm">Best Score: </span>
                <span className="text-green-400 font-bold">{bestScore}</span>
              </div>
              <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 px-4 py-2">
                <span className="text-gray-400 text-sm">Avg Score: </span>
                <span className="text-blue-400 font-bold">{Math.round(totalScore / attempts)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Password Input Section */}
          <div className="space-y-6">
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
              <h2 className="text-xl font-bold text-white mb-4">Enter Your Password</h2>
              
              <div className="relative mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type your password here..."
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pr-12"
                  onKeyPress={(e) => e.key === 'Enter' && evaluatePassword()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <button
                onClick={evaluatePassword}
                disabled={!password.trim() || loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Check Password Strength
                  </>
                )}
              </button>

              {attempts > 0 && (
                <button
                  onClick={resetGame}
                  className="w-full mt-3 border border-gray-600 text-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  Reset Challenge
                </button>
              )}
            </div>

            {/* Password Tips */}
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
              <h3 className="text-lg font-bold text-white mb-4">Password Security Tips</h3>
              <div className="space-y-2">
                {passwordTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Strength Score */}
                <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Password Strength</h3>
                    {getStrengthIcon(result.strength)}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-2xl font-bold ${getStrengthColor(result.strength)}`}>
                        {result.strength}
                      </span>
                      <span className="text-2xl font-bold text-cyan-400">{result.score}/100</span>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          result.score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                          result.score >= 60 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' :
                          result.score >= 40 ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                          'bg-gradient-to-r from-red-500 to-orange-600'
                        }`}
                        style={{ width: `${result.score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-blue-300 text-sm">
                      <strong>Estimated crack time:</strong> {result.crackTime}
                    </p>
                  </div>
                </div>

                {/* Feedback */}
                <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Feedback & Suggestions</h3>
                  
                  {result.feedback.warning && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-amber-300 text-sm">{result.feedback.warning}</p>
                      </div>
                    </div>
                  )}

                  {result.feedback.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white text-sm">Suggestions for improvement:</h4>
                      {result.feedback.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300 text-sm">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {result.score >= 80 && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-green-300 text-sm">
                          Excellent! This is a strong password that would be very difficult to crack.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">Ready to Test?</h3>
                  <p className="text-gray-500">Enter a password to see its strength analysis</p>
                </div>
              </div>
            )}

            {/* Back to Play Hub */}
            <div className="text-center">
              <button
                onClick={() => router.push('/play-hub')}
                className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 hover:border-gray-500 transition-all duration-300"
              >
                Back to Play Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}