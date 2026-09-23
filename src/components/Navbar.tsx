import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PATHS } from '../routes/paths';
import { FileText, Users, BarChart3, LogOut, Shield, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(PATHS.LOGIN);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link to={PATHS.NOTES} className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-indigo flex items-center justify-center text-white shadow-sm">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg tracking-tight">SecureNotes</span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                to={PATHS.NOTES}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(PATHS.NOTES)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FileText className={`w-4 h-4 ${isActive(PATHS.NOTES) ? 'text-blue-600' : 'text-blue-500'}`} />
                <span>Notes</span>
              </Link>

              {isAdmin && (
                <Link
                  to={PATHS.ADMIN_USERS}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(PATHS.ADMIN_USERS)
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Users className={`w-4 h-4 ${isActive(PATHS.ADMIN_USERS) ? 'text-purple-600' : 'text-purple-500'}`} />
                  <span>User Management</span>
                </Link>
              )}

              <Link
                to={PATHS.AGGREGATIONS}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(PATHS.AGGREGATIONS)
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className={`w-4 h-4 ${isActive(PATHS.AGGREGATIONS) ? 'text-amber-600' : 'text-amber-500'}`} />
                <span>Aggregations</span>
              </Link>
            </nav>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-medium text-gray-900">{user?.name}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isAdmin
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isAdmin ? (
                <Shield className="w-3.5 h-3.5 text-purple-600" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              )}
              {user?.role.toUpperCase()}
            </span>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 border border-gray-200 hover:border-rose-200 transition-all cursor-pointer ml-2"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
