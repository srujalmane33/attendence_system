import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAttendance } from '../../redux/attendenceSlice';
import NavBar from '../../component/navBar';
import UserSideBar from '../../component/userSideBar';

export default function UserDashboard() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.attendance);

  const handleClockIn = () => {
    dispatch(markAttendance({ timestamp: new Date().toISOString() }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <UserSideBar />
      <main className="pl-72 pt-24 pr-8 max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Punch Interface</h2>
          <p className="text-slate-500 mb-6">Log your active daily attendance log directly onto the backend cluster.</p>
          
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

          <button 
            onClick={handleClockIn} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-95 disabled:bg-slate-300"
          >
            {loading ? 'Logging Entry...' : '🚀 Punch Attendance Log'}
          </button>
        </div>
      </main>
    </div>
  );
}