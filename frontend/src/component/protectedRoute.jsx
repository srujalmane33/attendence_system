import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

export default function ProtectedRoute({ allowedRoles }) {
  const { token, user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClearSession = () => {
    dispatch(logout());
    navigate('/login');
  };

  // 1. Wait for any async initialization checks to complete
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Validating clearances...</p>
        </div>
      </div>
    );
  }

  // 2. No session token found? Force redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Fallback check for missing profiles or uninitialized properties
  if (user && (!user.role || user.role === '')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div className="text-amber-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Role Mismatch Detected</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Your credentials parsed successfully, but your local session holds no active role mapping.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl text-left font-mono text-xs text-slate-500 mb-6 border border-slate-100">
            <p className="font-bold text-slate-700 mb-1">// Redux User Entity Status:</p>
            <p>name: "{user.name}"</p>
            <p>role: "{user.role}" (unrecognized)</p>
          </div>
          <button
            onClick={handleClearSession}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            Clear Session & Retry
          </button>
        </div>
      </div>
    );
  }

  // 4. Token exists, but wait for the user state hydration to fully land in Redux
  if (!user || !user.role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Synchronizing permissions...</p>
        </div>
      </div>
    );
  }

  // 5. Validate roles safely and handle mismatches (Allows 'student' to map cleanly)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // 6. Authorized! Safely render nested children elements
  return <Outlet />;
}