import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types/user';
import { userService } from '../services/userService';
import { Pagination } from '../components/Pagination';
import { Modal } from '../components/Modal';
import { Alert } from '../components/Alert';
import {
  UserPlus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  RefreshCw,
  Users,
  Mail,
  User as UserIcon,
  Lock,
  Sparkles,
  AlertTriangle,
  Check,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('user');
  const [formInterests, setFormInterests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await userService.getUsers({ page: currentPage, limit });
      setUsers(res.items);
      setTotalPages(res.pagination.totalPages);
      setTotalItems(res.pagination.totalItems);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users list.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenAdd = () => {
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormRole('user');
    setFormInterests('chess, reading');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormRole(u.role);
    setFormInterests(u.interests?.join(', ') || '');
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      setError('Name and email are required.');
      return;
    }

    const interests = formInterests
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);

    try {
      setIsSubmitting(true);
      setError(null);

      if (editingUser) {
        await userService.updateUser(editingUser._id, {
          name: formName.trim(),
          email: formEmail.trim(),
          role: formRole,
          interests,
        });
        setSuccessMsg(`User ${formName} updated successfully.`);
        setEditingUser(null);
      } else {
        if (!formPassword || formPassword.length < 6) {
          setError('Password must be at least 6 characters.');
          setIsSubmitting(false);
          return;
        }
        await userService.createUser({
          name: formName.trim(),
          email: formEmail.trim(),
          password: formPassword,
          role: formRole,
          interests,
        });
        setSuccessMsg(`User ${formName} created successfully.`);
        setIsAddOpen(false);
      }

      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to save user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setIsSubmitting(true);
      await userService.deleteUser(id);
      setSuccessMsg('User deleted successfully.');
      setDeleteConfirmUser(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Users className="w-5 h-5 text-purple-600" />
            </span>
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Admin portal to view, add, update, and manage platform users.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="btn-icon btn-icon-gray"
            style={{ width: '2.375rem', height: '2.375rem' }}
            title="Refresh users"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="btn-primary"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {successMsg && <Alert type="success" message={successMsg} onClose={() => setSuccessMsg(null)} />}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Interests
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    <div className="animate-spin inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-2" />
                    <div>Loading users...</div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    No users registered yet.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const initial = u.name ? u.name.charAt(0).toUpperCase() : 'U';
                  const isUserAdmin = u.role === 'admin';

                  return (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                              isUserAdmin
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {initial}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{u.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-blue-500 inline" />
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isUserAdmin
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isUserAdmin ? (
                            <Shield className="w-3.5 h-3.5 text-purple-600" />
                          ) : (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {u.interests && u.interests.length > 0 ? (
                            u.interests.map((int, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-md font-medium"
                              >
                                <Sparkles className="w-2.5 h-2.5 text-purple-500" />
                                {int}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">None</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="btn-icon btn-icon-indigo"
                            title="Edit User"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmUser(u)}
                            className="btn-icon btn-icon-rose"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 pb-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={(p) => setCurrentPage(p)}
            onLimitChange={(l) => {
              setLimit(l);
              setCurrentPage(1);
            }}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddOpen || !!editingUser}
        onClose={() => {
          setIsAddOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? `Edit User: ${editingUser.name}` : 'Add New User'}
      >
        <form onSubmit={handleSaveUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-4 w-4 text-blue-500" />
              </div>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <input
                type="email"
                required
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="user@example.com"
              />
            </div>
          </div>

          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-amber-500" />
                </div>
                <input
                  type="password"
                  required
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              Role
            </label>
            <select
              value={formRole}
              onChange={(e) => setFormRole(e.target.value as UserRole)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="user">User (Standard)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Interests (comma separated)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Sparkles className="h-4 w-4 text-purple-500" />
              </div>
              <input
                type="text"
                value={formInterests}
                onChange={(e) => setFormInterests(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="chess, reading, travel"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-5">
            <button
              type="button"
              onClick={() => {
                setIsAddOpen(false);
                setEditingUser(null);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete User Confirmation */}
      <Modal
        isOpen={!!deleteConfirmUser}
        onClose={() => setDeleteConfirmUser(null)}
        title="Confirm User Deletion"
        maxWidth="sm"
      >
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
          </div>
          <p className="text-sm text-gray-600 leading-normal">
            Are you sure you want to delete user{' '}
            <strong className="text-gray-900">{deleteConfirmUser?.name}</strong> (
            {deleteConfirmUser?.email})?
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={() => setDeleteConfirmUser(null)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deleteConfirmUser && handleDeleteUser(deleteConfirmUser._id)}
            disabled={isSubmitting}
            className="btn-danger"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Deleting...' : 'Delete User'}</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};
