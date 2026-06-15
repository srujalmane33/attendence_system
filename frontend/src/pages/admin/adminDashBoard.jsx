import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import NavBar from '../../component/navBar';
import AdminSideBar from '../../component/adminSideBar';
import { API_URL } from '../../config';

// Optimized Student Card View Component via Memoization
const StudentCard = memo(({ student, formatTime, getInitials }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 group">
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-inner transition-colors ${
            student.status === 'In-Classroom' 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              : student.status === 'Left'
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                : 'bg-slate-50 text-slate-400 border border-slate-100'
          }`}>
            {getInitials(student.name)}
          </div>
          <div className="truncate">
            <h4 className="font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors truncate">
              {student.name}
            </h4>
            <p className="text-slate-400 font-mono text-xs font-semibold mt-0.5">
              {student.studentId}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3 mt-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-400">Classroom Entry:</span>
            <span className="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {formatTime(student.entryTime)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-400">Classroom Exit:</span>
            <span className="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {formatTime(student.exitTime)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Daily Status</span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
          student.status === 'In-Classroom'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
            : student.status === 'Left'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
              : 'bg-slate-100 text-slate-500 border-slate-200'
        }`}>
          {student.status === 'In-Classroom' && (
            <>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>In Class</span>
            </>
          )}
          {student.status === 'Left' && (
            <>
              <span>✓</span>
              <span>Checked Out</span>
            </>
          )}
          {student.status === 'Absent' && (
            <>
              <span>⏳</span>
              <span>Not Logged</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
});
StudentCard.displayName = 'StudentCard';

// Optimized Student Row Table Component via Memoization
const StudentRow = memo(({ student, formatTime, getInitials }) => {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 group">
      <td className="py-4 px-6 font-medium text-slate-800">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center font-extrabold text-xs shadow-inner ${
            student.status === 'In-Classroom' 
              ? 'bg-emerald-50 text-emerald-600'
              : student.status === 'Left'
                ? 'bg-indigo-50 text-indigo-600'
                : 'bg-slate-50 text-slate-400'
          }`}>
            {getInitials(student.name)}
          </div>
          <div className="truncate">
            <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
              {student.name}
            </div>
            <div className="text-slate-400 font-mono text-[10px] font-semibold">
              {student.studentId}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-slate-600 font-mono text-sm">
        {formatTime(student.entryTime)}
      </td>
      <td className="py-4 px-6 text-slate-600 font-mono text-sm">
        {formatTime(student.exitTime)}
      </td>
      <td className="py-4 px-6">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${
          student.status === 'In-Classroom'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
            : student.status === 'Left'
              ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
              : 'bg-slate-100 text-slate-500 border-slate-200'
        }`}>
          {student.status === 'In-Classroom' && (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>In Class</span>
            </>
          )}
          {student.status === 'Left' && <span>Checked Out</span>}
          {student.status === 'Absent' && <span>Not Logged</span>}
        </span>
      </td>
    </tr>
  );
});
StudentRow.displayName = 'StudentRow';

export default function AdminDashBoard() {
  const { token } = useSelector((state) => state.auth);

  // Core data states
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom layout view, textual search, sorting metrics, and filter control states
  const [selectedFilter, setSelectedFilter] = useState('total');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('grid'); 
  const [sortBy, setSortBy] = useState('name'); 
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchAdminMetrics = async () => {
      setLoading(true);
      setError(null);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const BASE_URL = API_URL;

      try {
        let logsRes;
        try {
          logsRes = await axios.get(`${BASE_URL}/attendance/admin/all`, config);
        } catch (err) {
          logsRes = await axios.get(`${BASE_URL}/attendence/admin/all`, config);
        }
        const fetchedLogs = logsRes.data || [];
        setLogs(fetchedLogs);

        try {
          // Pointed to /auth/users to match backend routing structure
          const usersRes = await axios.get(`${BASE_URL}/auth/users`, config);
          setUsers(usersRes.data || []);
        } catch (err) {
          const uniqueStudentsMap = {};
          fetchedLogs.forEach(log => {
            const sId = log.student?.id || log.studentId;
            if (sId) {
              uniqueStudentsMap[sId] = log.student || { name: 'Registered Student', studentId: sId };
            }
          });
          setUsers(Object.values(uniqueStudentsMap));
        }
      } catch (err) {
        console.error('Error loading admin metrics:', err);
        setError(err.response?.data?.message || 'Failed to synchronize with MongoDB database clusters.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminMetrics();
  }, [token]);

  // Isolate and compute live records bounded strictly to the targeted filter date
  const filteredLogsForDate = useMemo(() => {
    return logs.filter(log => {
      const logDate = log.date || (log.entryTime ? log.entryTime.split('T')[0] : '');
      return logDate === selectedDate;
    });
  }, [logs, selectedDate]);

  const activeStudentsList = useMemo(() => filteredLogsForDate.filter(log => log.status === 'In-Classroom'), [filteredLogsForDate]);
  const completedStudentsList = useMemo(() => filteredLogsForDate.filter(log => log.status === 'Left'), [filteredLogsForDate]);

  // Data mapping pipeline handling tabs, queries, and multi-parameter sorting matrices
  const filteredStudents = useMemo(() => {
    let resultList = [];
    switch (selectedFilter) {
      case 'active':
        resultList = activeStudentsList.map(log => ({
          id: log.student?.id || log.studentId,
          name: log.student?.name || 'Unknown Student',
          studentId: log.student?.studentId || log.studentId || '—',
          status: 'In-Classroom',
          entryTime: log.entryTime,
          exitTime: null
        }));
        break;
      case 'completed':
        resultList = completedStudentsList.map(log => ({
          id: log.student?.id || log.studentId,
          name: log.student?.name || 'Unknown Student',
          studentId: log.student?.studentId || log.studentId || '—',
          status: 'Left',
          entryTime: log.entryTime,
          exitTime: log.exitTime
        }));
        break;
      case 'total':
      default:
        resultList = users.map(u => {
          const todayActivity = filteredLogsForDate.find(log => (log.student?.id === u.id || log.student?.studentId === u.studentId));
          return {
            id: u.id,
            name: u.name || 'Student',
            studentId: u.studentId || '—',
            status: todayActivity ? todayActivity.status : 'Absent',
            entryTime: todayActivity ? todayActivity.entryTime : null,
            exitTime: todayActivity ? todayActivity.exitTime : null
          };
        });
        break;
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      resultList = resultList.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.studentId.toLowerCase().includes(query)
      );
    }

    return resultList.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'time') {
        const timeA = a.entryTime ? new Date(a.entryTime).getTime() : Infinity;
        const timeB = b.entryTime ? new Date(b.entryTime).getTime() : Infinity;
        return timeA - timeB;
      } else if (sortBy === 'status') {
        const order = { 'In-Classroom': 1, 'Left': 2, 'Absent': 3 };
        return (order[a.status] || 99) - (order[b.status] || 99);
      }
      return 0;
    });
  }, [selectedFilter, activeStudentsList, completedStudentsList, users, filteredLogsForDate, searchQuery, sortBy]);

  // Utility rendering functions wrapped in stable references
  const formatTime = useCallback((timeString) => {
    if (!timeString) return '—';
    const d = new Date(timeString);
    return isNaN(d.getTime()) ? '—' : d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  }, []);

  const getInitials = useCallback((name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <AdminSideBar />

      <main className="px-4 md:pl-72 pt-24 pb-24 md:pb-12 pr-4 md:pr-8 max-w-7xl mx-auto">
        
        {/* Header Block with Date Selection */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Administrative KPI Panel</h1>
            <p className="text-slate-500 text-sm mt-1">
              Select any card to dynamically filter, sort, and inspect active student files.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-slate-200">
            <span className="text-sm font-semibold text-slate-500">Target Date:</span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-sm font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl text-sm mb-6 flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-bold">Database Synchronicity Alert</p>
              <p className="text-xs text-amber-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-500 font-medium">Downloading live organizational logs...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* KPI Selection Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Directory Registry */}
              <div 
                onClick={() => setSelectedFilter('total')}
                className={`p-6 rounded-2xl shadow-sm border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] select-none ${
                  selectedFilter === 'total'
                    ? 'bg-indigo-600 text-white border-indigo-700 ring-4 ring-indigo-100 shadow-indigo-100'
                    : 'bg-white text-slate-800 border-slate-100 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-wider ${selectedFilter === 'total' ? 'text-indigo-100' : 'text-slate-400'}`}>
                  Total Student Registry
                </span>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-4xl font-extrabold tracking-tight">{users.length}</span>
                  <span className="text-2xl">👥</span>
                </div>
                <div className="mt-2 text-xs font-semibold flex items-center justify-between">
                  <span>View All Registered Students</span>
                  <span>{selectedFilter === 'total' && '● Active Filter'}</span>
                </div>
              </div>

              {/* Card 2: Active Attending Students */}
              <div 
                onClick={() => setSelectedFilter('active')}
                className={`p-6 rounded-2xl shadow-sm border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] select-none ${
                  selectedFilter === 'active'
                    ? 'bg-emerald-600 text-white border-emerald-700 ring-4 ring-emerald-100 shadow-emerald-100'
                    : 'bg-white text-slate-800 border-slate-100 hover:border-slate-300 hover:shadow-md border-l-4 border-l-emerald-500'
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-wider ${selectedFilter === 'active' ? 'text-emerald-100' : 'text-slate-400'}`}>
                  Active Attending Students (In Classroom)
                </span>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-4xl font-extrabold tracking-tight">{activeStudentsList.length}</span>
                  <span className="text-2xl">📍</span>
                </div>
                <div className="mt-2 text-xs font-semibold flex items-center justify-between">
                  <span>View Currently Present</span>
                  <span>{selectedFilter === 'active' && '● Active Filter'}</span>
                </div>
              </div>

              {/* Card 3: Completed Sessions Today */}
              <div 
                onClick={() => setSelectedFilter('completed')}
                className={`p-6 rounded-2xl shadow-sm border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] select-none ${
                  selectedFilter === 'completed'
                    ? 'bg-rose-600 text-white border-rose-700 ring-4 ring-rose-100 shadow-rose-100'
                    : 'bg-white text-slate-800 border-slate-100 hover:border-slate-300 hover:shadow-md border-l-4 border-l-rose-500'
                }`}
              >
                <span className={`text-xs font-bold uppercase tracking-wider ${selectedFilter === 'completed' ? 'text-rose-100' : 'text-slate-400'}`}>
                  Completed Sessions Today (Checked Out)
                </span>
                <div className="flex items-baseline justify-between mt-4">
                  <span className="text-4xl font-extrabold tracking-tight">{completedStudentsList.length}</span>
                  <span className="text-2xl">🚶</span>
                </div>
                <div className="mt-2 text-xs font-semibold flex items-center justify-between">
                  <span>View Daily Check-Out Logs</span>
                  <span>{selectedFilter === 'completed' && '● Active Filter'}</span>
                </div>
              </div>

            </div>

            {/* Interactive Control & Layout Panel */}
            <div className="bg-slate-100/50 p-6 rounded-2xl border border-slate-200/50 space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 capitalize">
                    {selectedFilter === 'total' && 'Total Student Directory'}
                    {selectedFilter === 'active' && 'Active Classroom Logs'}
                    {selectedFilter === 'completed' && 'Completed Check-Out Sessions'}
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Viewing {filteredStudents.length} matching records for date {selectedDate}.
                  </p>
                </div>

                {/* Filters, Sort & View Control Segment */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Bar */}
                  <input
                    type="text"
                    placeholder="Search name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44"
                  />

                  {/* Sort Selector Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-bold focus:outline-none"
                  >
                    <option value="name">Sort: Name (A-Z)</option>
                    <option value="time">Sort: Entry Time</option>
                    <option value="status">Sort: Status</option>
                  </select>

                  {/* Layout View Toggler */}
                  <div className="bg-slate-200 p-1 rounded-xl flex items-center gap-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Grid Layout"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-all ${
                        viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="List Layout"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Student Cards or Table List Container */}
              {filteredStudents.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((student, idx) => (
                      <StudentCard 
                        key={`grid-student-${student.id || student.studentId || idx}`} 
                        student={student}
                        formatTime={formatTime}
                        getInitials={getInitials}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <th className="py-4 px-6">Student Information</th>
                            <th className="py-4 px-6">Classroom Entry</th>
                            <th className="py-4 px-6">Classroom Exit</th>
                            <th className="py-4 px-6">Daily Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredStudents.map((student, idx) => (
                            <StudentRow 
                              key={`list-student-${student.id || student.studentId || idx}`} 
                              student={student}
                              formatTime={formatTime}
                              getInitials={getInitials}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              ) : (
                <div className="py-16 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-4xl block mb-2 font-emoji">⏳</span>
                  <p className="text-slate-400 font-medium text-sm">
                    No active records match your criteria for this date.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}