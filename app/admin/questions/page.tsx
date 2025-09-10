'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Edit, Trash2, Search, Filter, BookOpen, 
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  category: string;
  createdAt: string;
}

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  
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

    loadQuestions();
  }, [isAuthenticated, user, pagination.page, categoryFilter, difficultyFilter]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAdminQuestions(
        pagination.page, 
        pagination.limit, 
        categoryFilter, 
        difficultyFilter
      );
      
      if (response.success && response.data) {
        setQuestions(response.data.questions);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await apiClient.deleteQuestion(id);
      if (response.success) {
        loadQuestions();
      }
    } catch (error) {
      console.error('Failed to delete question:', error);
    }
  };

  const filteredQuestions = questions.filter(question =>
    question.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['all', 'general', 'phishing', 'passwords', 'malware', 'social-engineering'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Manage Questions</h1>
            <p className="text-gray-300">Create, edit, and organize quiz questions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Question
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Difficulties' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white">Questions ({pagination.total})</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading questions...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Questions Found</h3>
              <p className="text-gray-500">Try adjusting your filters or create a new question</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700/50">
              {filteredQuestions.map((question) => (
                <div key={question._id} className="p-6 hover:bg-gray-700/20 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                          {question.category}
                        </span>
                        <span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded text-xs font-medium">
                          {question.difficulty}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2">{question.question}</h3>
                      
                      <div className="space-y-1 mb-3">
                        {question.options.map((option, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            {index === question.correctAnswer ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-gray-500" />
                            )}
                            <span className={index === question.correctAnswer ? 'text-green-300' : 'text-gray-400'}>
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <p className="text-gray-400 text-sm">{question.explanation}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setEditingQuestion(question)}
                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question._id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-6 border-t border-gray-700/50">
              <div className="flex justify-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`px-3 py-1 rounded ${
                      page === pagination.page
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal would go here - simplified for now */}
      {(showCreateModal || editingQuestion) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingQuestion ? 'Edit Question' : 'Create Question'}
            </h2>
            <p className="text-gray-400 mb-4">
              {editingQuestion ? 'Update the question details below.' : 'Add a new question to the quiz database.'}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingQuestion(null);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-all">
                {editingQuestion ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}