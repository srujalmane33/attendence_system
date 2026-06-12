import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import NavBar from '../../component/navBar';
import AdminSideBar from '../../component/adminSideBar';

export default function AdminDashBoard() {
  const { token } = useSelector((state) => state.auth);

  // Component local states
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Rely exclusively on the token for data-fetching confirmation.
    // If the token vanishes (Logout), abort processing to prevent ghost requests.
    if (!token) return;

    const fetchAdminMetrics = async () => {
      setLoading(true);
      setError(null);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

      try {
        // 1. Fetch all attendance logs from backend
        let logsRes;
        try {
          logsRes = await axios.get(`${BASE_URL}/attendance/admin/all`, config);
        } catch (err) {
          logsRes = await axios.get(`${BASE_URL}/attendence/admin/all`, config);
        }
        const fetchedLogs = logsRes.data || [];
        setLogs(fetchedLogs);

        // 2. Fetch all registered users/students
        try {
          const usersRes = await axios.get(`${BASE_URL}/users`, config);
          setUsers(usersRes.data || []);
        } catch (err) {
          // Dynamic fallback registry derivation
          const uniqueStudentsMap = {};
          fetchedLogs.forEach(log => {
            const sId = log.student?.id || log.studentId;
            if (sId) {
              uniqueStudentsMap[sId] = log.student || { name: 'Student' };
            }
          });
          setUsers(Object.values(uniqueStudentsMap));
        }
      } catch (err) {
        console.error('Error loading admin metrics:', err);
        setError(err.response?.data?.message || 'Failed to sync with backend database');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminMetrics();
  }, [token]); // Execution relies entirely on token mount changes

  // Compute live KPI metrics based on current database state
  const getMetrics = () => {
    const todayStr = new Date().toISOString().split('T')[0];

    // Filter logs created/dated today
    const todaysLogs = logs.filter(log => {
      const logDate = log.date || (log.entryTime ? log.entryTime.split('T')[0] : '');
      return logDate === todayStr;
    });

    // Count states
    const activePresent = todaysLogs.filter(log => log.status === 'In-Classroom').length;
    const completedLeft = todaysLogs.filter(log => log.status === 'Left').length;

    return {
      totalStudents: users.length || 0,
      activePresent,
      completedLeft,
      todaysLogs
    };
  };

  const { totalStudents, activePresent, completedLeft, todaysLogs } = getMetrics();

  // Parse timestamps cleanly for logs list
  const formatTime = (timeString) => {
    if (!timeString) return '—';
    const d = new Date(timeString);
    return isNaN(d.getTime()) ? '—' : d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <AdminSideBar />

      <main className="pl-72 pt-24 pr-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Administrative KPI Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time status metrics compiled directly from MongoDB via Prisma.</p>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl text-sm mb-6 flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-bold">Database Synchronization Notice</p>
              <p className="text-xs text-amber-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Downloading live organization matrices...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* KPI Metrics row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Directory Registry */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[140px]">
                <span className="text-sm font-semibold text-slate-400">Total Student Directory Registry</span>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-4xl font-extrabold text-slate-800">{totalStudents}</span>
                  <span className="text-2xl">👥</span>
                </div>
              </div>

              {/* Card 2: Active Present Today */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-emerald-500 border border-slate-100 flex flex-col justify-between min-h-[140px]">
                <span className="text-sm font-semibold text-slate-400">Active Attending Students (In Classroom)</span>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-4xl font-extrabold text-emerald-600">{activePresent}</span>
                  <span className="text-2xl">📍</span>
                </div>
              </div>

              {/* Card 3: Checked Out Today */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-rose-500 border border-slate-100 flex flex-col justify-between min-h-[140px]">
                <span className="text-sm font-semibold text-slate-400">Completed Sessions Today (Checked Out)</span>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-4xl font-extrabold text-rose-600">{completedLeft}</span>
                  <span className="text-2xl">🚶</span>
                </div>
              </div>

            </div>

            {/* Today's Real-time Live Log Feed */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Today's Live Attendance Feed</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Chronological record of student activities for today.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Live Feed Active</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Student ID</th>
                      <th className="py-3 px-4">Entry Timestamp</th>
                      <th className="py-3 px-4">Exit Timestamp</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
                    {todaysLogs.length > 0 ? (
                      todaysLogs.map((log, idx) => (
                        <tr key={log.id || idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-slate-800">{log.student?.name || 'Unknown Student'}</td>
                          <td className="py-4 px-4 text-slate-500 font-medium font-mono text-xs">{log.student?.studentId || '—'}</td>
                          <td className="py-4 px-4 text-slate-600 font-mono text-xs">{formatTime(log.entryTime)}</td>
                          <td className="py-4 px-4 text-slate-600 font-mono text-xs">{formatTime(log.exitTime)}</td>
                          <td className="py-4 px-4 text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              log.status === 'In-Classroom'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {log.status === 'In-Classroom' ? '📍 In Class' : '✓ Checked Out'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-12 text-center text-slate-400 text-sm">
                          <span className="text-3xl block mb-2 font-emoji">⏳</span>
                          No check-ins logged yet today.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}