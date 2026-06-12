import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function UserSideBar() {
  const location = useLocation();
  const links = [
    { name: 'Dashboard', path: '/user/dashboard' },
    { name: 'My Logs', path: '/user/history' },
    { name: 'Profile Settings', path: '/user/profile' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen pt-20 px-4 fixed left-0 border-r border-slate-800">
      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
              location.pathname === link.path ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}