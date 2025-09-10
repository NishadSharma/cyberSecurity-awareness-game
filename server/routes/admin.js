const express = require('express');
const { body, validationResult } = require('express-validator');
const { Question, Scenario, GameSession, Leaderboard } = require('../models/Game');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and admin role requirement to all routes
router.use(authenticateToken);
router.use(requireRole(['admin']));

// Dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    // Basic stats
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalQuestions = await Question.countDocuments();
    const totalScenarios = await Scenario.countDocuments();
    const totalGameSessions = await GameSession.countDocuments({ completed: true });

    // Average scores by category
    const scoresByCategory = await GameSession.aggregate([
      { $match: { completed: true } },
      { $group: {
        _id: '$gameType',
        averageScore: { $avg: '$score' },
        totalSessions: { $sum: 1 }
      }}
    ]);

    // Top missed questions
    const missedQuestions = await GameSession.aggregate([
      { $match: { gameType: 'quiz', completed: true } },
      { $unwind: '$answers' },
      { $match: { 'answers.isCorrect': false } },
      { $group: {
        _id: '$answers.questionId',
        missedCount: { $sum: 1 }
      }},
      { $sort: { missedCount: -1 } },
      { $limit: 10 },
      { $lookup: {
        from: 'questions',
        localField: '_id',
        foreignField: '_id',
        as: 'question'
      }},
      { $unwind: '$question' },
      { $project: {
        question: '$question.question',
        category: '$question.category',
        difficulty: '$question.difficulty',
        missedCount: 1
      }}
    ]);

    // Recent activity
    const recentSessions = await GameSession.find({ completed: true })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('userId gameType score createdAt');

    // User engagement over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyActivity = await GameSession.aggregate([
      { $match: { 
        completed: true,
        createdAt: { $gte: thirtyDaysAgo }
      }},
      { $group: {
        _id: { 
          $dateToString: { 
            format: '%Y-%m-%d', 
            date: '$createdAt' 
          }
        },
        sessions: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' }
      }},
      { $project: {
        date: '$_id',
        sessions: 1,
        uniqueUsers: { $size: '$uniqueUsers' }
      }},
      { $sort: { date: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalQuestions,
          totalScenarios,
          totalGameSessions
        },
        scoresByCategory,
        missedQuestions,
        recentSessions,
        dailyActivity
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// Questions CRUD
router.get('/questions', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, difficulty } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(filter);

    res.json({
      success: true,
      data: {
        questions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
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

router.post('/questions', [
  body('question').notEmpty().withMessage('Question is required'),
  body('options').isArray({ min: 2 }).withMessage('At least 2 options required'),
  body('correctAnswer').isInt({ min: 0 }).withMessage('Valid correct answer index required'),
  body('explanation').notEmpty().withMessage('Explanation is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Valid difficulty required'),
  body('category').isIn(['general', 'phishing', 'passwords', 'malware', 'social-engineering']).withMessage('Valid category required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const question = new Question(req.body);
    await question.save();

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: { question }
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create question'
    });
  }
});

router.put('/questions/:id', [
  body('question').notEmpty().withMessage('Question is required'),
  body('options').isArray({ min: 2 }).withMessage('At least 2 options required'),
  body('correctAnswer').isInt({ min: 0 }).withMessage('Valid correct answer index required'),
  body('explanation').notEmpty().withMessage('Explanation is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Valid difficulty required'),
  body('category').isIn(['general', 'phishing', 'passwords', 'malware', 'social-engineering']).withMessage('Valid category required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: { question }
    });
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update question'
    });
  }
});

router.delete('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question'
    });
  }
});

// Scenarios CRUD
router.get('/scenarios', async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (category && category !== 'all') filter.category = category;

    const scenarios = await Scenario.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Scenario.countDocuments(filter);

    res.json({
      success: true,
      data: {
        scenarios,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get scenarios error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scenarios'
    });
  }
});

router.post('/scenarios', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('situation').notEmpty().withMessage('Situation is required'),
  body('choices').isArray({ min: 2 }).withMessage('At least 2 choices required'),
  body('category').isIn(['phishing', 'social-engineering', 'data-breach', 'malware']).withMessage('Valid category required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const scenario = new Scenario(req.body);
    await scenario.save();

    res.status(201).json({
      success: true,
      message: 'Scenario created successfully',
      data: { scenario }
    });
  } catch (error) {
    console.error('Create scenario error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create scenario'
    });
  }
});

router.put('/scenarios/:id', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('situation').notEmpty().withMessage('Situation is required'),
  body('choices').isArray({ min: 2 }).withMessage('At least 2 choices required'),
  body('category').isIn(['phishing', 'social-engineering', 'data-breach', 'malware']).withMessage('Valid category required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const scenario = await Scenario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }

    res.json({
      success: true,
      message: 'Scenario updated successfully',
      data: { scenario }
    });
  } catch (error) {
    console.error('Update scenario error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update scenario'
    });
  }
});

router.delete('/scenarios/:id', async (req, res) => {
  try {
    const scenario = await Scenario.findByIdAndDelete(req.params.id);
    
    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }

    res.json({
      success: true,
      message: 'Scenario deleted successfully'
    });
  } catch (error) {
    console.error('Delete scenario error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete scenario'
    });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password -refreshToken');

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

router.put('/users/:id/role', [
  body('role').isIn(['user', 'admin']).withMessage('Valid role required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
});

module.exports = router;