import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import UserDashboard from './pages/user/userDashboard';
import UserHistory from './pages/user/userHistory';
import UserProfile from './pages/user/userProfile';
import AdminDashBoard from './pages/admin/adminDashBoard';
import UserManagement from './pages/admin/userManagement';
import AttendanceLog from './pages/admin/attendenceLog';
import ProtectedRoute from './component/protectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Channels */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Regular Authenticated User Nodes (Allows both "user" and "student" schemas) */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'student']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/history" element={<UserHistory />} />
          <Route path="/user/profile" element={<UserProfile />} />
        </Route>

        {/* Administrative Clearance Operations */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashBoard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/logs" element={<AttendanceLog />} />
        </Route>

        {/* Fallback Interceptor */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}