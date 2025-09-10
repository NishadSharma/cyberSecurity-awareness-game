'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Search, Shield, User, Crown, Calendar,
  TrendingUp, Clock, Award
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

    loadUsers();
  }, [isAuthenticated, user, pagination.page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAdminUsers(pagination.page, pagination.limit);
      
      if (response.success && response.data) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    try {
      const response = await apiClient.updateUserRole(userId, newRole);
      if (response.success) {
        loadUsers();
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Manage Users</h1>
          <p className="text-gray-300">View and manage user accounts and permissions</p>
        </div>

        {/* Search */}
        <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm p-6 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white">Users ({pagination.total})</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No Users Found</h3>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700/50">
              {filteredUsers.map((adminUser) => (
                <div key={adminUser._id} className="p-6 hover:bg-gray-700/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-700/30 rounded-full">
                        {adminUser.role === 'admin' ? (
                          <Crown className="h-6 w-6 text-yellow-400" />
                        ) : (
                          <User className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-white">{adminUser.name}</h3>
                        <p className="text-gray-400">{adminUser.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            adminUser.role === 'admin' 
                              ? 'bg-yellow-500/10 text-yellow-400' 
                              : 'bg-blue-500/10 text-blue-400'
                          }`}>
                            {adminUser.role}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            adminUser.isActive 
                              ? 'bg-green-500/10 text-green-400' 
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {adminUser.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(adminUser.createdAt).toLocaleDateString()}</span>
                      </div>
                      {adminUser.lastLogin && (
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                          <Clock className="h-4 w-4" />
                          <span>Last login {new Date(adminUser.lastLogin).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      {adminUser._id !== user?._id && (
                        <select
                          value={adminUser.role}
                          onChange={(e) => handleRoleChange(adminUser._id, e.target.value)}
                          className="px-3 py-1 bg-gray-900/50 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
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
    </div>
  );
}