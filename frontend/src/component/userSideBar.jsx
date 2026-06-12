import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function UserSideBar() {
  const location = useLocation();

  // Helper function to dynamically highlight the current active sidebar route
  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 p-3.5 rounded-xl font-medium transition-all duration-200 cursor-pointer text-sm ";
    const isActive = location.pathname === path;

    return isActive
      ? `${baseClass} bg-blue-600 text-white shadow-md shadow-blue-500/10`
      : `${baseClass} text-slate-400 hover:bg-slate-900/50 hover:text-slate-200`;
  };

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-64 bg-slate-950 text-slate-300 p-4 border-r border-slate-900 hidden md:flex flex-col justify-between z-40">
      <div className="space-y-1.5 mt-4">
        {/* Navigation Link to User Dashboard */}
        <Link to="/user/dashboard" className={getLinkClass('/user/dashboard')}>
          <span className="text-lg">📊</span>
          Dashboard
        </Link>

        {/* Navigation Link to Personal History Logs */}
        <Link to="/user/history" className={getLinkClass('/user/history')}>
          <span className="text-lg">📋</span>
          My Logs
        </Link>

        {/* Navigation Link to User Profile Settings */}
        <Link to="/user/profile" className={getLinkClass('/user/profile')}>
          <span className="text-lg">👤</span>
          Profile Settings
        </Link>
      </div>

      {/* Footer Branding Area */}
      <div className="p-4 border-t border-slate-900 text-center">
        <p className="text-xs text-slate-600">AttendancePro v1.0.0</p>
      </div>
    </aside>
  );
}