import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from './paths';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { NotesPage } from '../pages/NotesPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AggregationsPage } from '../pages/AggregationsPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public / Auth routes */}
      <Route
        path={PATHS.LOGIN}
        element={isAuthenticated ? <Navigate to={PATHS.NOTES} replace /> : <LoginPage />}
      />
      <Route
        path={PATHS.REGISTER}
        element={isAuthenticated ? <Navigate to={PATHS.NOTES} replace /> : <RegisterPage />}
      />

      {/* Protected application routes */}
      <Route
        path={PATHS.NOTES}
        element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={PATHS.ADMIN_USERS}
        element={
          <ProtectedRoute adminOnly>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={PATHS.AGGREGATIONS}
        element={
          <ProtectedRoute>
            <AggregationsPage />
          </ProtectedRoute>
        }
      />

      {/* Root and Fallback redirection */}
      <Route path={PATHS.ROOT} element={<Navigate to={PATHS.NOTES} replace />} />
      <Route path="*" element={<Navigate to={PATHS.NOTES} replace />} />
    </Routes>
  );
};
