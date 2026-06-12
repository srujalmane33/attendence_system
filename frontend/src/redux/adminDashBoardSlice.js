import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchLiveStats = createAsyncThunk('adminDashboard/fetchStats', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    const response = await axios.get('http://localhost:3000/api/admin/stats', config);
    return response.data; // Expected: { presentToday: 12, absentToday: 3, totalUsers: 15 }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard metrics');
  }
});

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState: { stats: { presentToday: 0, absentToday: 0, totalUsers: 0 }, loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveStats.fulfilled, (state, action) => { state.stats = action.payload; });
  }
});

export default adminDashboardSlice.reducer;