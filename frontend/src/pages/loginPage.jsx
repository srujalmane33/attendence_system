import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../redux/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token, user } = useSelector((state) => state.auth || { loading: false, error: null, token: null, user: null });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (token && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({
      ...formData,
      role: selectedRole
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-200">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 text-2xl mb-4 shadow-inner border border-indigo-100">
            🔒
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Access your secure attendance workspace portal
          </p>
        </div>

        {/* Dynamic Interactive Role Tabs */}
        <div className="bg-slate-100 p-1.5 rounded-xl flex">
          <button
            type="button"
            onClick={() => handleRoleSelect('student')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              formData.role === 'student'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🎓 Student
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
              formData.role === 'admin'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🛡️ Admin
          </button>
        </div>

        {/* Dynamic Backend Error Banner */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl text-sm flex items-start gap-2.5 shadow-sm">
            <span className="text-lg mt-0.5">⚠️</span>
            <div className="space-y-1">
              <p className="font-bold">Authentication Failed</p>
              <p className="text-xs text-amber-600 leading-relaxed">
                {typeof error === 'object' ? error.message : error}
              </p>
            </div>
          </div>
        )}

        {/* Main Sign-In Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-300 text-slate-800 text-sm font-medium bg-white"
              placeholder="sachin@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-300 text-slate-800 text-sm font-medium bg-white"
              placeholder="••••••"
            />
          </div>

          {/* Dynamic Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] flex justify-center items-center text-sm tracking-wide ${
              formData.role === 'admin'
                ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-200 disabled:bg-slate-200 disabled:text-slate-400'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 disabled:bg-slate-200 disabled:text-slate-400'
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400 mr-2"></div>
                Verifying Credentials...
              </>
            ) : (
              formData.role === 'admin' ? 'Sign In as Administrator' : 'Sign In as Student'
            )}
          </button>
        </form>

        {/* Registration Redirection Footer */}
        <div className="text-center pt-2">
          <p className="text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}