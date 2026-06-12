import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authSlice';
import attendanceReducer from '../redux/attendenceSlice';
import adminDashboardReducer from '../redux/adminDashBoardSlice';
import userManagementReducer from '../redux/userManagementSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    adminDashboard: adminDashboardReducer,
    userManagement: userManagementReducer,
  },
});