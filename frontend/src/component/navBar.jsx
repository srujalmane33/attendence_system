import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

export default function NavBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="bg-slate-800 text-white h-16 flex items-center justify-between px-4 md:px-6 shadow-md fixed w-full top-0 z-50">
      <h1 className="text-lg md:text-xl font-bold tracking-wide flex-shrink-0">⏱️ AttendancePro</h1>
      <div className="flex items-center gap-2 md:gap-4">
        {user?.name && (
          <span className="text-xs md:text-sm bg-slate-700 px-2 md:px-3 py-1 rounded-full border border-slate-600 truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
            {user.name} ({user.role})
          </span>
        )}
        <button 
          onClick={() => dispatch(logout())}
          className="bg-red-500 hover:bg-red-600 text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 md:py-2 rounded transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}