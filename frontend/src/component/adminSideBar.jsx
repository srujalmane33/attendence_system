import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSideBar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-1.5 md:gap-3 p-2 md:p-3.5 rounded-xl font-medium transition-all duration-200 cursor-pointer text-xs md:text-sm ";
    const isActive = location.pathname === path;

    return isActive
      ? `${baseClass} bg-violet-600 text-white shadow-md shadow-violet-500/10`
      : `${baseClass} text-slate-400 hover:bg-slate-900/50 hover:text-slate-200`;
  };

  return (
    <aside className="fixed bottom-0 md:top-16 left-0 right-0 md:right-auto md:bottom-0 h-16 md:h-auto md:w-64 bg-slate-950 text-slate-300 p-2 md:p-4 border-t md:border-t-0 md:border-r border-slate-900 flex flex-row md:flex-col justify-between items-center md:items-stretch z-40">
      <div className="flex flex-row md:flex-col justify-around md:justify-start w-full gap-2 md:gap-0 md:space-y-1.5">
        {/* Navigation Link to Admin Dashboard Overview */}
        <Link to="/admin/dashboard" className={`${getLinkClass('/admin/dashboard')} flex-1 md:flex-none justify-center md:justify-start py-2 md:py-3.5`}>
          <span className="text-lg">📊</span>
          <span className="font-semibold">Overview</span>
        </Link>

        {/* Navigation Link to Registered Users Directory */}
        <Link to="/admin/users" className={`${getLinkClass('/admin/users')} flex-1 md:flex-none justify-center md:justify-start py-2 md:py-3.5`}>
          <span className="text-lg">👥</span>
          <span className="font-semibold">Manage Staff</span>
        </Link>

        {/* Navigation Link to Historical Attendance Log Sheets */}
        <Link to="/admin/logs" className={`${getLinkClass('/admin/logs')} flex-1 md:flex-none justify-center md:justify-start py-2 md:py-3.5`}>
          <span className="text-lg">📋</span>
          <span className="font-semibold">System Logs</span>
        </Link>
      </div>

      <div className="hidden md:block p-4 border-t border-slate-900 text-center">
        <p className="text-xs text-slate-600">AttendancePro v1.0.0</p>
      </div>
    </aside>
  );
}