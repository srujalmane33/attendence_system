import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAttendance } from '../../redux/attendenceSlice'; // Adjust import name based on your exact admin fetch thunk
import NavBar from '../../component/navBar';
import AdminSideBar from '../../component/adminSideBar';
// import { getAllAttendance } from '../../redux/attendenceSlice';
export default function AttendanceLog() {
  const dispatch = useDispatch();
  
  // Safeguard state mapping matching your slice structure
  const { logs, loading } = useSelector((state) => state.attendance || { logs: [], loading: false });

  // Fetch all logs from database on component initialization
  useEffect(() => {
    if (dispatch) {
      dispatch(getAllAttendance());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <AdminSideBar />
      <main className="pl-72 pt-24 pr-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Master Activity Logs</h2>
            <p className="text-slate-400 text-sm">System-wide operational tracking stream metrics with webcam verification snapshots.</p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span>Syncing database records...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400 font-medium">
              No student logs found in the collection.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 uppercase text-xs font-bold tracking-wider border-b border-slate-100">
                    <th className="p-4">Student Info</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Entry Details</th>
                    <th className="p-4">Exit Details</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Nested Student Document Identification */}
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">{log.student?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-400 font-mono">{log.student?.studentId || 'N/A'}</div>
                      </td>
                      
                      {/* Log Date Stamp */}
                      <td className="p-4 font-medium text-slate-600 font-mono">
                        {log.date}
                      </td>

                      {/* Entry Time and Snapshot column */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {log.entryPhotoUrl ? (
                            <a href={log.entryPhotoUrl} target="_blank" rel="noreferrer" className="block relative group shrink-0">
                              <img 
                                src={log.entryPhotoUrl} 
                                alt="Entry verified capture" 
                                className="h-10 w-10 rounded-lg object-cover ring-2 ring-slate-100 group-hover:scale-105 transition-transform shadow-sm"
                              />
                              <span className="absolute -top-1 -right-1 bg-emerald-500 h-2.5 w-2.5 rounded-full border border-white"></span>
                            </a>
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0">NO CAM</div>
                          )}
                          <span className="font-mono text-slate-700 font-medium">
                            {log.entryTime ? new Date(log.entryTime).toLocaleTimeString() : 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Exit Time and Snapshot column */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {log.exitPhotoUrl ? (
                            <a href={log.exitPhotoUrl} target="_blank" rel="noreferrer" className="block relative group shrink-0">
                              <img 
                                src={log.exitPhotoUrl} 
                                alt="Exit verified capture" 
                                className="h-10 w-10 rounded-lg object-cover ring-2 ring-slate-100 group-hover:scale-105 transition-transform shadow-sm"
                              />
                              <span className="absolute -top-1 -right-1 bg-rose-500 h-2.5 w-2.5 rounded-full border border-white"></span>
                            </a>
                          ) : log.exitTime ? (
                            <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-[10px] font-bold shrink-0">NO CAM</div>
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-300 flex items-center justify-center text-xs shrink-0">—</div>
                          )}
                          <span className="font-mono text-slate-700 font-medium">
                            {log.exitTime ? new Date(log.exitTime).toLocaleTimeString() : 'Pending...'}
                          </span>
                        </div>
                      </td>

                      {/* Status Badges */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
                          log.status === 'In-Classroom' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${log.status === 'In-Classroom' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}