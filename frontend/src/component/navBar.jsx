import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

export default function NavBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="bg-slate-800 text-white h-16 flex items-center justify-between px-6 shadow-md fixed w-full top-0 z-50">
      <h1 className="text-xl font-bold tracking-wide">⏱️ AttendancePro</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm bg-slate-700 px-3 py-1 rounded-full border border-slate-600">
          {user?.name} ({user?.role})
        </span>
        <button 
          onClick={() => dispatch(logout())}
          className="bg-red-500 hover:bg-red-600 text-sm font-semibold px-4 py-2 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}