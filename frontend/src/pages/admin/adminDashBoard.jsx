import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLiveStats } from '../../redux/adminDashBoardSlice';
import NavBar from '../../component/navBar';
import AdminSideBar from '../../component/adminSideBar';

export default function AdminDashBoard() {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchLiveStats());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <AdminSideBar />
      <main className="pl-72 pt-24 pr-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Administrative Performance KPI Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <span className="text-slate-400 text-sm font-semibold">Total Corporate Directory Registry</span>
            <p className="text-4xl font-extrabold text-slate-800 mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm border-l-4 border-l-green-500">
            <span className="text-slate-400 text-sm font-semibold">Active Attending Staff Present Today</span>
            <p className="text-4xl font-extrabold text-green-600 mt-2">{stats.presentToday}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm border-l-4 border-l-red-500">
            <span className="text-slate-400 text-sm font-semibold">Flagged Absences Identified Today</span>
            <p className="text-4xl font-extrabold text-red-600 mt-2">{stats.absentToday}</p>
          </div>
        </div>
      </main>
    </div>
  );
}