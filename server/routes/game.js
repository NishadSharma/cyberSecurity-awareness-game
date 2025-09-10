const express = require('express');
const { Question, GameSession, PhishingScenario } = require('../models/Game');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get quiz questions
router.get('/questions', authenticateToken, async (req, res) => {
  try {
    const { category = 'general', difficulty = 'medium', limit = 10 } = req.query;
    
    const questions = await Question.aggregate([
      { 
        $match: { 
          category: category === 'all' ? { $exists: true } : category,
          difficulty: difficulty === 'all' ? { $exists: true } : difficulty
        } 
      },
      { $sample: { size: parseInt(limit) } }
    ]);

    // Remove correct answers from response
    const questionsForClient = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      category: q.category
    }));

    res.json({
      success: true,
      data: {
        questions: questionsForClient,
        sessionId: new Date().getTime() // Simple session ID
      }
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch questions'
    });
  }
});

// Get phishing scenarios
router.get('/phishing-scenarios', authenticateToken, async (req, res) => {
  try {
    const { category = 'all', difficulty = 'all', limit = 5 } = req.query;
    
    const scenarios = await PhishingScenario.aggregate([
      { 
        $match: { 
          category: category === 'all' ? { $exists: true } : category,
          difficulty: difficulty === 'all' ? { $exists: true } : difficulty
        } 
      },
      { $sample: { size: parseInt(limit) } }
    ]);

    // Remove correct answers from response
    const scenariosForClient = scenarios.map(s => ({
      _id: s._id,
      title: s.title,
      description: s.description,
      email: s.email,
      difficulty: s.difficulty,
      category: s.category
    }));

    res.json({
      success: true,
      data: {
        scenarios: scenariosForClient,
        sessionId: new Date().getTime()
      }
    });
  } catch (error) {
    console.error('Get phishing scenarios error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch phishing scenarios'
    });
  }
});
// Submit quiz answers
router.post('/submit-quiz', authenticateToken, async (req, res) => {
  try {
    const { answers, timeSpent, sessionId } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answers format'
      });
    }

    // Get the questions to check answers
    const questionIds = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    
    let correctAnswers = 0;
    const detailedResults = [];

    answers.forEach(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (question) {
        const isCorrect = question.correctAnswer === answer.selectedAnswer;
        if (isCorrect) correctAnswers++;
        
        detailedResults.push({
          questionId: answer.questionId,
          question: question.question,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation
        });
      }
    });

    const score = Math.round((correctAnswers / answers.length) * 100);

    // Save game session
    const gameSession = new GameSession({
      userId: req.user._id,
      gameType: 'quiz',
      score,
      totalQuestions: answers.length,
      correctAnswers,
      timeSpent: timeSpent || 0,
      completed: true,
      answers: answers.map(a => ({
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer,
        isCorrect: questions.find(q => q._id.toString() === a.questionId)?.correctAnswer === a.selectedAnswer,
        timeSpent: a.timeSpent || 0
      }))
    });

    await gameSession.save();

    res.json({
      success: true,
      data: {
        score,
        correctAnswers,
        totalQuestions: answers.length,
        percentage: score,
        results: detailedResults,
        sessionId: gameSession._id
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz'
    });
  }
});

// Submit phishing scenario answers
router.post('/submit-phishing', authenticateToken, async (req, res) => {
  try {
    const { answers, timeSpent, sessionId } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answers format'
      });
    }

    // Get the scenarios to check answers
    const scenarioIds = answers.map(a => a.scenarioId);
    const scenarios = await PhishingScenario.find({ _id: { $in: scenarioIds } });
    
    let correctAnswers = 0;
    const detailedResults = [];

    answers.forEach(answer => {
      const scenario = scenarios.find(s => s._id.toString() === answer.scenarioId);
      if (scenario) {
        const isCorrect = scenario.isPhishing === answer.isPhishing;
        if (isCorrect) correctAnswers++;
        
        detailedResults.push({
          scenarioId: answer.scenarioId,
          title: scenario.title,
          userAnswer: answer.isPhishing,
          correctAnswer: scenario.isPhishing,
          isCorrect,
          explanation: scenario.explanation,
          redFlags: scenario.redFlags,
          email: scenario.email
        });
      }
    });

    const score = Math.round((correctAnswers / answers.length) * 100);

    // Save game session
    const gameSession = new GameSession({
      userId: req.user._id,
      gameType: 'phishing',
      score,
      totalQuestions: answers.length,
      correctAnswers,
      timeSpent: timeSpent || 0,
      completed: true,
      answers: answers.map(a => ({
        questionId: a.scenarioId,
        selectedAnswer: a.isPhishing ? 1 : 0,
        isCorrect: scenarios.find(s => s._id.toString() === a.scenarioId)?.isPhishing === a.isPhishing,
        timeSpent: a.timeSpent || 0
      }))
    });

    await gameSession.save();

    res.json({
      success: true,
      data: {
        score,
        correctAnswers,
        totalQuestions: answers.length,
        percentage: score,
        results: detailedResults,
        sessionId: gameSession._id
      }
    });
  } catch (error) {
    console.error('Submit phishing scenario error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit phishing scenario'
    });
  }
});
module.exports = router;