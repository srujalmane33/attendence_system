import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: { history: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(markAttendance.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(markAttendance.fulfilled, (state, action) => { state.loading = false; state.history.unshift(action.payload); })
      .addCase(markAttendance.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export default attendanceSlice.reducer;