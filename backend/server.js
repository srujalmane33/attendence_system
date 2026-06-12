import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {connectDB }from './config/db.js';

// Route Imports - Matching your exact filenames in the sidebar
import authRoutes from "./routes/authRoute.js"
import attendanceRoutes from './routes/attendenceRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
connectDB();

// Middleware00
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
    
}));
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// Base Test Route
app.get('/', (req, res) => {
    res.send("Attendance System API running perfectly.");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});