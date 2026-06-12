import React from 'react';
import NavBar from '../../component/navBar';
import AdminSideBar from '../../component/adminSideBar';

export default function AttendanceLog() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <AdminSideBar />
      <main className="pl-72 pt-24 pr-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Master Activity Logs</h2>
          <p className="text-slate-400 text-sm">System-wide operational tracking stream metrics are routed directly to this node panel display view.</p>
          <div className="mt-8 border border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 font-medium">
            System log analytics node monitoring channels are running in streaming mode.
          </div>
        </div>
      </main>
    </div>
  );
}