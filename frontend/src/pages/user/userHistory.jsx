import React from 'react';
import { useSelector } from 'react-redux';
import NavBar from '../../component/navBar';
import UserSideBar from '../../component/userSideBar';

export default function UserHistory() {
  const { history } = useSelector((state) => state.attendance);

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <UserSideBar />
      <main className="pl-72 pt-24 pr-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Attendance Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-sm font-semibold">
                  <th className="p-4">Date Identification</th>
                  <th className="p-4">Timestamp Reference</th>
                  <th className="p-4">Status Field</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {history.length === 0 ? (
                  <tr><td colSpan="3" className="p-4 text-center text-slate-400">No punch history identified yet.</td></tr>
                ) : (
                  history.map((log, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="p-4">{new Date(log.timestamp).toLocaleDateString()}</td>
                      <td className="p-4">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">SUCCESS</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}