import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markAttendance, logExitTime, getAttendanceLogs, clearAttendanceError } from '../../redux/attendenceSlice';
import NavBar from '../../component/navBar';
import UserSideBar from '../../component/userSideBar';
import CameraCapture from '../../component/CameraComponent'; // Imported your new webcam component

export default function UserDashboard() {
  const dispatch = useDispatch();
  const webcamRef = useRef(null); // Reference to track webcam frames
  
  const { logs, loading, error } = useSelector((state) => state.attendance || { logs: [], loading: false, error: null });

  const [successMessage, setSuccessMessage] = useState('');
  const [liveTime, setLiveTime] = useState(new Date());

  // Live-updating digital clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Fetch log history on mount to determine today's current check-in/out state
  useEffect(() => {
    dispatch(getAttendanceLogs());
    dispatch(clearAttendanceError());
  }, [dispatch]);

  // Determine user's attendance state for today
  const getTodayStatus = () => {
    const todayStr = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Find if we already have an entry for today
    const todaysLog = logs.find(log => {
      const logDate = log.date || (log.entryTime ? log.entryTime.split('T')[0] : '');
      return logDate === todayStr;
    });

    if (!todaysLog) {
      return { state: 'NOT_CHECKED_IN', data: null };
    }
    return { state: todaysLog.status === 'In-Classroom' ? 'CHECKED_IN' : 'LEFT', data: todaysLog };
  };

  const { state: todayState, data: activeLog } = getTodayStatus();

  // Trigger Entry Check-In
  const handleClockIn = async () => {
    if (loading) return;
    setSuccessMessage('');

    // Capture entry snapshot from webcam stream
    const imageSrc = webcamRef.current ? webcamRef.current.getScreenshot() : null;
    if (!imageSrc) {
      alert("⚠️ Camera initialization failed! Please enable webcam permissions to mark entry.");
      return;
    }

    // Pass the base64 encoded image frame straight down to your existing slice/async thunk
    const result = await dispatch(markAttendance({ 
      timestamp: new Date().toISOString(),
      image: imageSrc 
    }));

    if (markAttendance.fulfilled.match(result)) {
      setSuccessMessage('🎉 Classroom Entry logged successfully! Enjoy your lecture.');
    }
  };

  // Trigger Exit Check-Out
  const handleClockExit = async () => {
    if (loading) return;
    setSuccessMessage('');

    // Capture exit snapshot from webcam stream
    const imageSrc = webcamRef.current ? webcamRef.current.getScreenshot() : null;
    if (!imageSrc) {
      alert("⚠️ Camera initialization failed! Please enable webcam permissions to mark exit.");
      return;
    }

    // Pass the base64 encoded image frame straight down into your logExitTime thunk
    const result = await dispatch(logExitTime({ image: imageSrc }));
    
    if (logExitTime.fulfilled.match(result)) {
      setSuccessMessage('🚶 Exit logged successfully! Have a great day.');
    }
  };

  const formattedTime = liveTime.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formattedDate = liveTime.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <UserSideBar />
      
      <main className="pl-72 pt-24 pr-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Attendance Interaction Card */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between min-h-[320px]">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Punch Interface</h2>
              <p className="text-slate-500 mb-6">Log your active daily classroom entry and exit times securely.</p>
              
              {/* Error messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3.5 rounded-xl mb-6 text-sm flex items-center gap-2">
                  <span className="text-base">⚠️</span> {error}
                </div>
              )}

              {/* Success Messages */}
              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3.5 rounded-xl mb-6 text-sm font-semibold flex items-center gap-2">
                  <span>{successMessage}</span>
                </div>
              )}
            </div>

            {/* Live Camera Capture Frame (Visible only when action can be taken) */}
            {(todayState === 'NOT_CHECKED_IN' || todayState === 'CHECKED_IN') && (
              <div className="mb-6 max-w-xs mx-auto lg:mx-0">
                <CameraCapture webcamRef={webcamRef} />
              </div>
            )}

            {/* Interactive Punch States */}
            <div className="mt-4">
              {todayState === 'NOT_CHECKED_IN' && (
                <button 
                  onClick={handleClockIn} 
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-10 py-4 rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Logging Entry...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Punch Classroom Entry</span>
                    </>
                  )}
                </button>
              )}

              {todayState === 'CHECKED_IN' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl text-sm font-medium">
                    📍 You checked into the classroom at <span className="font-bold font-mono">{activeLog?.entryTime ? new Date(activeLog.entryTime).toLocaleTimeString() : 'N/A'}</span>.
                  </div>
                  <button 
                    onClick={handleClockExit} 
                    disabled={loading}
                    className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white px-10 py-4 rounded-xl font-bold tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Logging Exit...</span>
                      </>
                    ) : (
                      <>
                        <span>🚶</span>
                        <span>Punch Exit Log</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {todayState === 'LEFT' && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-6 rounded-xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-bold">✓</div>
                  <div>
                    <h4 className="font-bold text-base">Attendance Completed!</h4>
                    <p className="text-emerald-600 text-xs mt-0.5 leading-relaxed">
                      Your entries are closed for today. Checked In: <span className="font-mono font-bold">{new Date(activeLog?.entryTime).toLocaleTimeString()}</span> | Checked Out: <span className="font-mono font-bold">{new Date(activeLog?.exitTime).toLocaleTimeString()}</span>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Dynamic Digital Clock Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-2xl text-white shadow-xl flex flex-col justify-between border border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Network Live</p>
              </div>
              <h3 className="text-lg font-bold text-slate-200">Current Reference Clock</h3>
            </div>

            <div className="my-8">
              <p className="text-4xl font-extrabold tracking-tight font-mono text-white select-none">
                {formattedTime}
              </p>
              <p className="text-slate-400 text-xs mt-2 font-medium">
                {formattedDate}
              </p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-300 leading-relaxed">
                Your coordinates, security credentials, and network timestamp signatures are logged automatically.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}