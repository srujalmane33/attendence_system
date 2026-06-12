import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAllUsers = createAsyncThunk('users/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const config = { headers: { Authorization: `Bearer ${auth.token}` } };
    const response = await axios.get('http://localhost:3000/api/admin/users', config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee roster');
  }
});

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState: { users: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; });
  }
});

export default userManagementSlice.reducer;