'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import PageTransition from '@/components/ui/page-transition';
import AnimatedButton from '@/components/ui/animated-button';

interface Question {
  _id: string;
  question: string;
  options: string[];
  difficulty: string;
  category: string;
}

interface QuizResult {
  questionId: string;
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

export default function QuizGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [sessionId, setSessionId] = useState<string>('');
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    loadQuestions();
  }, [isAuthenticated]);

  // Timer effect
  useEffect(() => {
    if (gameCompleted || loading) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up, auto-submit current question
          handleNextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, gameCompleted, loading]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getQuestions('all', 'all', 10);
      
      if (response.success && response.data) {
        setQuestions(response.data.questions);
        setSessionId(response.data.sessionId);
        setStartTime(Date.now());
        setQuestionStartTime(Date.now());
        setTimeLeft(30);
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const timeSpent = Date.now() - questionStartTime;
    const newAnswer = {
      questionId: questions[currentQuestionIndex]._id,
      selectedAnswer: selectedAnswer !== null ? selectedAnswer : -1, // -1 for no answer
      timeSpent
    };

    setAnswers([...answers, newAnswer]);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
      setTimeLeft(30);
    } else {
      submitQuiz([...answers, newAnswer]);
    }
  };

  const submitQuiz = async (finalAnswers: any[]) => {
    try {
      setSubmitting(true);
      const totalTimeSpent = Math.round((Date.now() - startTime) / 1000);
      
      const response = await apiClient.submitQuiz(finalAnswers, totalTimeSpent, sessionId);
      
      if (response.success && response.data) {
        setResults(response.data);
        setGameCompleted(true);
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setGameCompleted(false);
    setResults(null);
    setTimeLeft(30);
    loadQuestions();
  };

  const goToPlayHub = () => {
    router.push('/play-hub');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (gameCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="p-4 bg-cyan-500/10 rounded-full border border-cyan-500/20">
                <Brain className="h-12 w-12 text-cyan-400" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h1>
            <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6 max-w-md mx-auto">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{results.score}%</div>
              <p className="text-gray-300">
                {results.correctAnswers} out of {results.totalQuestions} correct
              </p>
            </div>
          </motion.div>

          {/* Detailed Results */}
          <div className="space-y-4 mb-8">
            {results.results.map((result: QuizResult, index: number) => (
              <motion.div
                key={result.questionId}
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
                      Question {index + 1}
                    </h3>
                    <p className="text-gray-300 mb-4">{result.question}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm">
                        <span className="text-gray-400">Your answer:</span>{' '}
                        <span className={result.isCorrect ? 'text-green-400' : 'text-red-400'}>
                          {questions.find(q => q._id === result.questionId)?.options[result.selectedAnswer]}
                        </span>
                      </p>
                      {!result.isCorrect && (
                        <p className="text-sm">
                          <span className="text-gray-400">Correct answer:</span>{' '}
                          <span className="text-green-400">
                            {questions.find(q => q._id === result.questionId)?.options[result.correctAnswer]}
                          </span>
                        </p>
                      )}
                    </div>
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
              onClick={restartQuiz}
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

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <PageTransition className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/20">
              <Brain className="h-8 w-8 text-cyan-400" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Cybersecurity Quiz</h1>
          <p className="text-gray-300">Test your knowledge and learn as you go</p>
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
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className={`text-sm font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-amber-400'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <motion.div
              className={`h-1 rounded-full transition-all duration-1000 ${
                timeLeft <= 10 ? 'bg-red-500' : 'bg-amber-500'
              }`}
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestionIndex}
              className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-8 mb-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  {currentQuestion.category}
                </span>
                <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                  {currentQuestion.difficulty}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      selectedAnswer === index
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                        : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index ? 'border-cyan-500' : 'border-gray-500'
                      }`}>
                        {selectedAnswer === index && (
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-cyan-500"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <AnimatedButton
            onClick={handleNextQuestion}
            disabled={submitting}
            variant="primary"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : currentQuestionIndex === questions.length - 1 ? (
              <>
                Finish Quiz
                <CheckCircle className="h-5 w-5" />
              </>
            ) : (
              <>
                Next Question
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </AnimatedButton>
        </motion.div>
      </div>
    </PageTransition>
  );
}