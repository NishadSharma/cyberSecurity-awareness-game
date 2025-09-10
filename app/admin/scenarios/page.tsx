'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Edit, Trash2, Search, AlertTriangle, 
  CheckCircle, XCircle
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

interface Scenario {
  _id: string;
  title: string;
  description: string;
  situation: string;
  choices: Array<{
    text: string;
    isCorrect: boolean;
    feedback: string;
  }>;
  category: string;
  createdAt: string;
}

export default function AdminScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
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

    loadScenarios();
  }, [isAuthenticated, user, pagination.page, categoryFilter]);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAdminScenarios(
        pagination.page, 
        pagination.limit, 
        categoryFilter
      );
      
      if (response.success && response.data) {
        setScenarios(response.data.scenarios);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScenario = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scenario?')) return;

    try {
      const response = await apiClient.deleteScenario(id);
      if (response.success) {
        loadScenarios();
      }
    } catch (error) {
      console.error('Failed to delete scenario:', error);
    }
  };

  const filteredScenarios = scenarios.filter(scenario =>
    scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scenario.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['all', 'phishing', 'social-engineering', 'data-breach', 'malware'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Manage Scenarios</h1>
            <p className="text-gray-300">Create and edit cybersecurity scenarios</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Scenario
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search scenarios..."
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
          </div>
        </div>

        {/* Scenarios Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading scenarios...</p>
          </div>
        ) : filteredScenarios.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">No Scenarios Found</h3>
            <p className="text-gray-500">Try adjusting your filters or create a new scenario</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredScenarios.map((scenario) => (
              <div key={scenario._id} className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded text-xs font-medium">
                        {scenario.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{scenario.title}</h3>
                    <p className="text-gray-300 text-sm mb-3">{scenario.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setEditingScenario(scenario)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteScenario(scenario._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                  <p className="text-blue-200 text-sm">
                    {scenario.situation.length > 150 
                      ? `${scenario.situation.substring(0, 150)}...` 
                      : scenario.situation
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-300">Choices:</h4>
                  {scenario.choices.map((choice, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      {choice.isCorrect ? (
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={choice.isCorrect ? 'text-green-300' : 'text-gray-400'}>
                        {choice.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
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
        )}
      </div>

      {/* Create/Edit Modal Placeholder */}
      {(showCreateModal || editingScenario) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingScenario ? 'Edit Scenario' : 'Create Scenario'}
            </h2>
            <p className="text-gray-400 mb-4">
              {editingScenario ? 'Update the scenario details below.' : 'Add a new scenario to the database.'}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingScenario(null);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-all">
                {editingScenario ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}