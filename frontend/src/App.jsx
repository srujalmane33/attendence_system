import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import AdminDashBoard from './pages/admin/adminDashBoard';
import ProtectedRoute from './component/protectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Routes: NO sidebars or dashboards can exist inside these components */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 2. Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashBoard />} />
          {/* Your other admin paths go here */}
        </Route>

        {/* 3. Global Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}