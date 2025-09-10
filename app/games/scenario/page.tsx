'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle, XCircle, RotateCcw, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

interface Scenario {
  _id: string;
  title: string;
  description: string;
  situation: string;
  choices: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  category: string;
}

export default function ScenarioGame() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [totalScore, setTotalScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState(0);
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    loadScenarios();
  }, [isAuthenticated]);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getScenarios('all', 5);
      
      if (response.success && response.data) {
        setScenarios(response.data.scenarios);
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoiceSelect = (choiceIndex: number) => {
    setSelectedChoice(choiceIndex);
  };

  const submitChoice = async () => {
    if (selectedChoice === null) return;

    try {
      setSubmitting(true);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const currentScenario = scenarios[currentScenarioIndex];
      
      const response = await apiClient.submitScenario(currentScenario._id, selectedChoice, timeSpent);
      
      if (response.success && response.data) {
        setResult(response.data);
        setShowResult(true);
        setTotalScore(totalScore + response.data.score);
        setCompletedScenarios(completedScenarios + 1);
      }
    } catch (error) {
      console.error('Failed to submit scenario:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const nextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setSelectedChoice(null);
      setShowResult(false);
      setResult(null);
      setStartTime(Date.now());
    } else {
      // All scenarios completed
      router.push('/play-hub');
    }
  };

  const restartScenarios = () => {
    setCurrentScenarioIndex(0);
    setSelectedChoice(null);
    setShowResult(false);
    setResult(null);
    setTotalScore(0);
    setCompletedScenarios(0);
    loadScenarios();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white">Loading scenarios...</p>
        </div>
      </div>
    );
  }

  const currentScenario = scenarios[currentScenarioIndex];
  const progress = ((currentScenarioIndex + 1) / scenarios.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20">
              <AlertTriangle className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Cybersecurity Scenarios</h1>
          <p className="text-gray-300">Navigate real-world security situations</p>
          
          {/* Score Display */}
          <div className="flex justify-center gap-4 mt-4">
            <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 px-4 py-2">
              <span className="text-gray-400 text-sm">Score: </span>
              <span className="text-cyan-400 font-bold">{totalScore}</span>
            </div>
            <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 px-4 py-2">
              <span className="text-gray-400 text-sm">Completed: </span>
              <span className="text-green-400 font-bold">{completedScenarios}/{scenarios.length}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Scenario {currentScenarioIndex + 1} of {scenarios.length}
            </span>
            <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Scenario Card */}
        {currentScenario && (
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                {currentScenario.category}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">{currentScenario.title}</h2>
            <p className="text-gray-300 mb-6">{currentScenario.description}</p>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">Situation:</h3>
              <p className="text-blue-200">{currentScenario.situation}</p>
            </div>

            {!showResult ? (
              <>
                <h3 className="text-lg font-semibold text-white mb-4">What would you do?</h3>
                <div className="space-y-3 mb-6">
                  {currentScenario.choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleChoiceSelect(index)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        selectedChoice === index
                          ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                          : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500 hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                          selectedChoice === index ? 'border-amber-500' : 'border-gray-500'
                        }`}>
                          {selectedChoice === index && (
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          )}
                        </div>
                        <span>{choice.text}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="text-center">
                  <button
                    onClick={submitChoice}
                    disabled={selectedChoice === null || submitting}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 mx-auto"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Choice
                        <CheckCircle className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                {/* Result Display */}
                <div className={`p-6 rounded-lg border ${
                  result.isCorrect 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-red-500/10 border-red-500/20'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    {result.isCorrect ? (
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-400" />
                    )}
                    <div>
                      <h3 className={`text-xl font-bold ${
                        result.isCorrect ? 'text-green-300' : 'text-red-300'
                      }`}>
                        {result.isCorrect ? 'Correct!' : 'Incorrect'}
                      </h3>
                      <p className="text-gray-300">Score: +{result.score} points</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/30 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Explanation:</h4>
                    <p className="text-gray-300">{result.feedback}</p>
                  </div>

                  {!result.isCorrect && (
                    <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-green-300 mb-2">Correct Choice:</h4>
                      <p className="text-green-200">
                        {currentScenario.choices[result.correctChoice]?.text}
                      </p>
                    </div>
                  )}
                </div>

                {/* Next Button */}
                <div className="text-center">
                  {currentScenarioIndex < scenarios.length - 1 ? (
                    <button
                      onClick={nextScenario}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Next Scenario
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">All Scenarios Complete!</h3>
                        <p className="text-gray-300 mb-4">
                          Final Score: <span className="text-cyan-400 font-bold">{totalScore}</span> points
                        </p>
                        <p className="text-gray-300">
                          You completed {completedScenarios} scenarios with an average score of{' '}
                          <span className="text-green-400 font-bold">
                            {Math.round(totalScore / completedScenarios)}
                          </span> points per scenario.
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={restartScenarios}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        >
                          <RotateCcw className="h-5 w-5" />
                          Play Again
                        </button>
                        <button
                          onClick={() => router.push('/play-hub')}
                          className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 hover:border-gray-500 transition-all duration-300"
                        >
                          Back to Play Hub
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}