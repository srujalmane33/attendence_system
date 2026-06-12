import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Authentication Channels
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';

// Regular Authenticated User / Student Pages
import UserDashboard from './pages/user/userDashBoard';
import UserHistory from './pages/user/userHistory';
import UserProfile from './pages/user/userProfile';

// Administrative Clearance Operations Pages
import AdminDashBoard from './pages/admin/adminDashBoard';
import UserManagement from './pages/admin/userManagement';
import AttendanceLog from './pages/admin/attendenceLog';

// Route Guard Gatekeeper
import ProtectedRoute from './component/protectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* =========================================================================
            1. Public Authentication Channels
            No core layouts, sidebars, or dashboards can leak into these components.
           ========================================================================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />


        {/* =========================================================================
            2. Regular Authenticated User Nodes (Allows both "user" and "student")
            Wrapped securely within the role-validating ProtectedRoute guard.
           ========================================================================= */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'student']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/history" element={<UserHistory />} />
          <Route path="/user/profile" element={<UserProfile />} />
        </Route>


        {/* =========================================================================
            3. Administrative Clearance Operations
            Wrapped securely to ensure only authenticated users with 'admin' access can mount.
           ========================================================================= */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashBoard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/logs" element={<AttendanceLog />} />
        </Route>


        {/* =========================================================================
            4. Fallback Interceptor
            Catches broken paths or dead sessions and smoothly routes back to authentication.
           ========================================================================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}