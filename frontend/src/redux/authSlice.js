import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to handle backend registration
export const registerUser = createAsyncThunk('auth/register', async (userData, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', userData);
    
    // Scenario A: If backend returns a token directly upon successful registration
    if (response.data?.token) {
      return response.data;
    }
    
    // Scenario B: If the backend only returns success, dispatch loginUser in the background
    const loginResult = await dispatch(loginUser({ email: userData.email, password: userData.password })).unwrap();
    return loginResult;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
    return rejectWithValue({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
  }
});

// Thunk to handle backend login
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', credentials);
    return response.data; // Expected: { token: '...', user: { name: '...', role: '...' } }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

const getSafeStorageItem = (key) => {
  try {
    const data = localStorage.getItem(key);
    if (!data || data === 'undefined' || data === 'null') {
      return null;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse localStorage key:', key, error);
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: getSafeStorageItem('user'), 
    token: localStorage.getItem('token') || null, 
    loading: false, 
    error: null 
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const handleAuthFulfilled = (state, action) => {
      state.loading = false;
      
      const token = action.payload.token || action.payload.data?.token;
      state.token = token;
      localStorage.setItem('token', token);

      let rawUser = {};
      if (action.payload.user) {
        rawUser = action.payload.user;
      } else if (action.payload.data?.user) {
        rawUser = action.payload.data.user;
      } else if (action.payload.role || action.payload.Role || action.payload.name) {
        rawUser = action.payload; 
      }

      const normalizedUser = {
        name: rawUser.name || rawUser.email || 'Student',
        role: (rawUser.role || rawUser.Role || 'student').toLowerCase().trim()
      };

      state.user = normalizedUser;
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    };

    builder
      // LOGIN REDUCERS
      .addCase(loginUser.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(loginUser.fulfilled, handleAuthFulfilled)
      .addCase(loginUser.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload; 
      })
      
      // REGISTRATION REDUCERS
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, handleAuthFulfilled)
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;