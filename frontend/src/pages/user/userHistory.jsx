import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBar from '../../component/navBar';
import UserSideBar from '../../component/userSideBar';
import { getAttendanceLogs } from '../../redux/attendenceSlice';

export default function UserHistory() {
  const dispatch = useDispatch();
  
  const { logs, loading, error } = useSelector((state) => state.attendance || { logs: [] });

  useEffect(() => {
    if (dispatch) {
      dispatch(getAttendanceLogs());
    }
  }, [dispatch]);

  // Safe datetime formatter
  const formatTime = (timeString) => {
    if (!timeString) return '—';
    const parsedDate = new Date(timeString);
    if (isNaN(parsedDate.getTime())) return '—';
    return parsedDate.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString, entryTimeFallback) => {
    const rawValue = dateString || entryTimeFallback;
    if (!rawValue) return 'No Date';
    const parsedDate = new Date(rawValue);
    if (isNaN(parsedDate.getTime())) return 'Format Error';
    return parsedDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <UserSideBar />
      
      <main className="pl-72 pt-24 pr-8 max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Your Attendance Records</h2>
            <p className="text-slate-500 text-sm mt-1">Review your historical daily classroom entry and exit check-ins.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-500 text-sm">Fetching logs from the backend cluster...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-sm font-semibold uppercase tracking-wider">
                    <th className="py-4 px-4">Date Identification</th>
                    <th className="py-4 px-4">Entry Time</th>
                    <th className="py-4 px-4">Exit Time</th>
                    <th className="py-4 px-4">Status Field</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 text-sm">
                  {logs && logs.length > 0 ? (
                    logs.map((log, index) => {
                      return (
                        <tr key={log.id || log._id || index} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 font-medium text-slate-800">
                            {formatDate(log.date, log.entryTime)}
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-mono">
                            {formatTime(log.entryTime)}
                          </td>
                          <td className="py-4 px-4 text-slate-600 font-mono">
                            {formatTime(log.exitTime)}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              log.status === 'In-Classroom' 
                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            }`}>
                              {log.status || 'Left'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-slate-400">
                        <span className="text-3xl block mb-2">📋</span>
                        No attendance logs found in your account history.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}