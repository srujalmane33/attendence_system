import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function UserSideBar() {
  const location = useLocation();

  // Helper function to dynamically highlight the current active sidebar route
  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-1.5 md:gap-3 p-2 md:p-3.5 rounded-xl font-medium transition-all duration-200 cursor-pointer text-xs md:text-sm ";
    const isActive = location.pathname === path;

    return isActive
      ? `${baseClass} bg-blue-600 text-white shadow-md shadow-blue-500/10`
      : `${baseClass} text-slate-400 hover:bg-slate-900/50 hover:text-slate-200`;
  };

  return (
    <aside className="fixed bottom-0 md:top-16 left-0 right-0 md:right-auto md:bottom-0 h-16 md:h-auto md:w-64 bg-slate-950 text-slate-300 p-2 md:p-4 border-t md:border-t-0 md:border-r border-slate-900 flex flex-row md:flex-col justify-between items-center md:items-stretch z-40">
      <div className="flex flex-row md:flex-col justify-around md:justify-start w-full gap-2 md:gap-0 md:space-y-1.5">
        {/* Navigation Link to User Dashboard */}
        <Link to="/user/dashboard" className={`${getLinkClass('/user/dashboard')} flex-1 md:flex-none justify-center md:justify-start py-2 md:py-3.5`}>
          <span className="text-lg">📊</span>
          <span className="font-semibold">Dashboard</span>
        </Link>

        {/* Navigation Link to Personal History Logs */}
        <Link to="/user/history" className={`${getLinkClass('/user/history')} flex-1 md:flex-none justify-center md:justify-start py-2 md:py-3.5`}>
          <span className="text-lg">📋</span>
          <span className="font-semibold">My Logs</span>
        </Link>

        {/* Navigation Link to User Profile Settings */}
        <Link to="/user/profile" className={`${getLinkClass('/user/profile')} flex-1 md:flex-none justify-center md:justify-start py-2 md:py-3.5`}>
          <span className="text-lg">👤</span>
          <span className="font-semibold">Profile</span>
        </Link>
      </div>

      {/* Footer Branding Area */}
      <div className="hidden md:block p-4 border-t border-slate-900 text-center">
        <p className="text-xs text-slate-600">AttendancePro v1.0.0</p>
      </div>
    </aside>
  );
}