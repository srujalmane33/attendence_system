import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSideBar() {
  const location = useLocation();

  const getLinkClass = (path) => {
    const baseClass = "flex items-center gap-3 p-3.5 rounded-xl font-medium transition-all duration-200 cursor-pointer text-sm ";
    const isActive = location.pathname === path;

    return isActive
      ? `${baseClass} bg-violet-600 text-white shadow-md shadow-violet-500/10`
      : `${baseClass} text-slate-400 hover:bg-slate-900/50 hover:text-slate-200`;
  };

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-64 bg-slate-950 text-slate-300 p-4 border-r border-slate-900 hidden md:flex flex-col justify-between z-40">
      <div className="space-y-1.5 mt-4">
        {/* Navigation Link to Admin Dashboard Overview */}
        <Link to="/admin/dashboard" className={getLinkClass('/admin/dashboard')}>
          <span className="text-lg">📊</span>
          Overview Panel
        </Link>

        {/* Navigation Link to Registered Users Directory */}
        <Link to="/admin/users" className={getLinkClass('/admin/users')}>
          <span className="text-lg">👥</span>
          Manage Staff
        </Link>

        {/* Navigation Link to Historical Attendance Log Sheets */}
        <Link to="/admin/logs" className={getLinkClass('/admin/logs')}>
          <span className="text-lg">📋</span>
          System Logs
        </Link>
      </div>

      <div className="p-4 border-t border-slate-900 text-center">
        <p className="text-xs text-slate-600">AttendancePro v1.0.0</p>
      </div>
    </aside>
  );
}