import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// =========================================================================
// THUNK 1: PUNCH ENTRY ATTENDANCE
// =========================================================================
export const markAttendance = createAsyncThunk('attendance/mark', async (data, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    const response = await axios.post('http://localhost:3000/api/attendance/entry', data, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to submit entry');
  }
});

// =========================================================================
// THUNK 2: PUNCH EXIT ATTENDANCE (NEW)
// =========================================================================
export const logExitTime = createAsyncThunk('attendance/exit', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    const response = await axios.put('http://localhost:3000/api/attendance/exit', {}, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to submit exit time');
  }
});

// =========================================================================
// THUNK 3: FETCH PERSISTENT HISTORICAL LOGS
// =========================================================================
export const getAttendanceLogs = createAsyncThunk('attendance/getLogs', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    const response = await axios.get('http://localhost:3000/api/attendance/my-logs', config);
    return response.data; 
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance logs');
  }
});

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: { 
    logs: [], 
    loading: false, 
    error: null 
  },
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ENTRY REDUCERS
      .addCase(markAttendance.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(markAttendance.fulfilled, (state, action) => { 
        state.loading = false;
        // The backend returns { message, data } - we append the updated/new object
        const newLog = action.payload.data || action.payload;
        state.logs = [newLog, ...state.logs]; 
      })
      .addCase(markAttendance.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      
      // EXIT REDUCERS
      .addCase(logExitTime.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logExitTime.fulfilled, (state, action) => {
        state.loading = false;
        const updatedLog = action.payload.data || action.payload;
        // Locate today's log item in memory and replace it with the new updated exit record
        state.logs = state.logs.map(log => 
          log.id === updatedLog.id || log._id === updatedLog._id ? updatedLog : log
        );
      })
      .addCase(logExitTime.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // RETRIEVAL REDUCERS
      .addCase(getAttendanceLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAttendanceLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = Array.isArray(action.payload) 
          ? action.payload 
          : action.payload?.logs || action.payload?.data || [];
      })
      .addCase(getAttendanceLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;