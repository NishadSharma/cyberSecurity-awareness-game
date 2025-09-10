'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, AlertTriangle, CheckCircle, XCircle, ArrowRight, 
  RotateCcw, Clock, Shield, Eye, EyeOff, Flag
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import PageTransition from '@/components/ui/page-transition';
import AnimatedButton from '@/components/ui/animated-button';

interface PhishingScenario {
  _id: string;
  title: string;
  description: string;
  email: {
    from: {
      name: string;
      email: string;
    };
    to: {
      name: string;
      email: string;
    };
    subject: string;
    body: string;
  };
  difficulty: string;
  category: string;
}

interface PhishingResult {
  scenarioId: string;
  title: string;
  userAnswer: boolean;
  correctAnswer: boolean;
  isCorrect: boolean;
  explanation: string;
  redFlags: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
  email: any;
}

export default function PhishingGame() {
  const [scenarios, setScenarios] = useState<PhishingScenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per scenario
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [scenarioStartTime, setScenarioStartTime] = useState<number>(Date.now());
  const [sessionId, setSessionId] = useState<string>('');
  const [showEmailDetails, setShowEmailDetails] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    loadScenarios();
  }, [isAuthenticated]);

  // Timer effect
  useEffect(() => {
    if (gameCompleted || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up, auto-submit current scenario
          handleNextScenario();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentScenarioIndex, gameCompleted, loading]);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPhishingScenarios('all', 'all', 5);
      
      if (response.success && response.data) {
        setScenarios(response.data.scenarios);
        setSessionId(response.data.sessionId);
        setStartTime(Date.now());
        setScenarioStartTime(Date.now());
        setTimeLeft(60);
      }
    } catch (error) {
      console.error('Failed to load phishing scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (isPhishing: boolean) => {
    setSelectedAnswer(isPhishing);
  };

  const handleNextScenario = () => {
    const timeSpent = Date.now() - scenarioStartTime;
    const newAnswer = {
      scenarioId: scenarios[currentScenarioIndex]._id,
      isPhishing: selectedAnswer !== null ? selectedAnswer : false, // Default to safe
      timeSpent
    };

    setAnswers([...answers, newAnswer]);
    setSelectedAnswer(null);

    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setScenarioStartTime(Date.now());
      setTimeLeft(60);
      setShowEmailDetails(false);
    } else {
      submitPhishing([...answers, newAnswer]);
    }
  };

  const submitPhishing = async (finalAnswers: any[]) => {
    try {
      setSubmitting(true);
      const totalTimeSpent = Math.round((Date.now() - startTime) / 1000);
      
      const response = await apiClient.submitPhishing(finalAnswers, totalTimeSpent, sessionId);
      
      if (response.success && response.data) {
        setResults(response.data);
        setGameCompleted(true);
      }
    } catch (error) {
      console.error('Failed to submit phishing scenarios:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const restartGame = () => {
    setCurrentScenarioIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setGameCompleted(false);
    setResults(null);
    setTimeLeft(60);
    setShowEmailDetails(false);
    loadScenarios();
  };

  const goToPlayHub = () => {
    router.push('/play-hub');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white">Loading phishing scenarios...</p>
        </div>
      </div>
    );
  }

  if (gameCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <div className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20">
                <Shield className="h-12 w-12 text-amber-400" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-4">Phishing Detection Complete!</h1>
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6 max-w-md mx-auto">
              <div className="text-3xl font-bold text-amber-400 mb-2">{results.score}%</div>
              <p className="text-gray-300">
                {results.correctAnswers} out of {results.totalQuestions} correct
              </p>
            </div>
          </motion.div>

          {/* Detailed Results */}
          <div className="space-y-6 mb-8">
            {results.results.map((result: PhishingResult, index: number) => (
              <motion.div
                key={result.scenarioId}
                className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {result.isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {result.title}
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-900/30 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-300 mb-2">Email Preview</h4>
                        <div className="text-sm space-y-1">
                          <p><span className="text-gray-400">From:</span> {result.email.from.name} &lt;{result.email.from.email}&gt;</p>
                          <p><span className="text-gray-400">Subject:</span> {result.email.subject}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900/30 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-300 mb-2">Your Analysis</h4>
                        <div className="text-sm">
                          <p className="mb-1">
                            <span className="text-gray-400">You said:</span>{' '}
                            <span className={result.userAnswer ? 'text-red-300' : 'text-green-300'}>
                              {result.userAnswer ? 'Phishing' : 'Legitimate'}
                            </span>
                          </p>
                          <p>
                            <span className="text-gray-400">Correct answer:</span>{' '}
                            <span className={result.correctAnswer ? 'text-red-300' : 'text-green-300'}>
                              {result.correctAnswer ? 'Phishing' : 'Legitimate'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {result.redFlags && result.redFlags.length > 0 && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-red-300 mb-2 flex items-center gap-2">
                          <Flag className="h-4 w-4" />
                          Red Flags Detected
                        </h4>
                        <div className="space-y-2">
                          {result.redFlags.map((flag, flagIndex) => (
                            <div key={flagIndex} className="text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  flag.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                                  flag.severity === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                                  'bg-blue-500/20 text-blue-300'
                                }`}>
                                  {flag.severity}
                                </span>
                                <span className="text-red-200 font-medium">{flag.type}</span>
                              </div>
                              <p className="text-red-300 text-xs ml-2">{flag.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-blue-300 text-sm">{result.explanation}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AnimatedButton
              onClick={restartGame}
              variant="primary"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <RotateCcw className="h-5 w-5" />
              Play Again
            </AnimatedButton>
            <AnimatedButton
              onClick={goToPlayHub}
              variant="secondary"
            >
              Back to Play Hub
            </AnimatedButton>
          </div>
        </div>
      </div>
    );
  }

  const currentScenario = scenarios[currentScenarioIndex];
  const progress = ((currentScenarioIndex + 1) / scenarios.length) * 100;

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20">
              <Mail className="h-8 w-8 text-amber-400" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Phishing Detection Challenge</h1>
          <p className="text-gray-300">Analyze emails and identify phishing attempts</p>
        </motion.div>

        {/* Progress Bar & Timer */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Scenario {currentScenarioIndex + 1} of {scenarios.length}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className={`text-sm font-bold ${timeLeft <= 15 ? 'text-red-400' : 'text-amber-400'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <motion.div
              className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <motion.div
              className={`h-1 rounded-full transition-all duration-1000 ${
                timeLeft <= 15 ? 'bg-red-500' : 'bg-amber-500'
              }`}
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Email Viewer */}
        <AnimatePresence mode="wait">
          {currentScenario && (
            <motion.div
              key={currentScenarioIndex}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              {/* Email Display */}
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-amber-400" />
                    Email Analysis
                  </h3>
                  <button
                    onClick={() => setShowEmailDetails(!showEmailDetails)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showEmailDetails ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="bg-white rounded-lg p-4 text-black">
                  <div className="border-b border-gray-200 pb-3 mb-3">
                    <div className="text-sm space-y-1">
                      <div><strong>From:</strong> {currentScenario.email.from.name} &lt;{currentScenario.email.from.email}&gt;</div>
                      <div><strong>To:</strong> {currentScenario.email.to.name} &lt;{currentScenario.email.to.email}&gt;</div>
                      <div><strong>Subject:</strong> {currentScenario.email.subject}</div>
                    </div>
                  </div>
                  
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {currentScenario.email.body}
                  </div>
                </div>

                {showEmailDetails && (
                  <motion.div
                    className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <h4 className="font-semibold text-blue-300 mb-2">Scenario Context</h4>
                    <p className="text-blue-200 text-sm">{currentScenario.description}</p>
                  </motion.div>
                )}
              </div>

              {/* Analysis Panel */}
              <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  Your Analysis
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                      {currentScenario.category}
                    </span>
                    <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                      {currentScenario.difficulty}
                    </span>
                  </div>

                  <h4 className="text-white font-medium mb-3">Is this email legitimate or phishing?</h4>
                  
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => handleAnswerSelect(false)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        selectedAnswer === false
                          ? 'border-green-500 bg-green-500/10 text-green-300'
                          : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === false ? 'border-green-500' : 'border-gray-500'
                        }`}>
                          {selectedAnswer === false && (
                            <motion.div 
                              className="w-2 h-2 rounded-full bg-green-500"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">Legitimate Email</div>
                          <div className="text-sm opacity-75">This email appears to be from a trusted source</div>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      onClick={() => handleAnswerSelect(true)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        selectedAnswer === true
                          ? 'border-red-500 bg-red-500/10 text-red-300'
                          : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswer === true ? 'border-red-500' : 'border-gray-500'
                        }`}>
                          {selectedAnswer === true && (
                            <motion.div 
                              className="w-2 h-2 rounded-full bg-red-500"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">Phishing Attempt</div>
                          <div className="text-sm opacity-75">This email is suspicious and likely malicious</div>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>

                <AnimatedButton
                  onClick={handleNextScenario}
                  disabled={submitting}
                  variant="primary"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : currentScenarioIndex === scenarios.length - 1 ? (
                    <>
                      Complete Analysis
                      <CheckCircle className="h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Next Email
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </AnimatedButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}