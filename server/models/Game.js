const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'phishing', 'passwords', 'malware', 'social-engineering'],
    default: 'general'
  }
});

const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    enum: ['quiz', 'scenario', 'password', 'phishing'],
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedAnswer: Number,
    isCorrect: Boolean,
    timeSpent: Number
  }]
}, {
  timestamps: true
});

const phishingScenarioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  email: {
    from: {
      name: String,
      email: String
    },
    to: {
      name: String,
      email: String
    },
    subject: String,
    body: String,
    attachments: [{
      name: String,
      type: String,
      suspicious: Boolean
    }]
  },
  redFlags: [{
    type: String,
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  isPhishing: {
    type: Boolean,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['banking', 'social-media', 'work', 'shopping', 'government'],
    default: 'general'
  }
});
const Question = mongoose.model('Question', questionSchema);
const GameSession = mongoose.model('GameSession', gameSessionSchema);
const PhishingScenario = mongoose.model('PhishingScenario', phishingScenarioSchema);

module.exports = {
  Question,
  GameSession,
  PhishingScenario
};