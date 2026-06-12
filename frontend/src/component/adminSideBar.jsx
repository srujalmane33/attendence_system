import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSideBar() {
  const location = useLocation();
  const links = [
    { name: 'Overview Panel', path: '/admin/dashboard' },
    { name: 'Manage Staff', path: '/admin/users' },
    { name: 'System Logs', path: '/admin/logs' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen pt-20 px-4 fixed left-0 border-r border-slate-800">
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
              location.pathname === link.path ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}