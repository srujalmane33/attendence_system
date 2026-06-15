import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {connectDB }from './config/db.js';
import authRoutes from "./routes/authRoute.js";
import attendanceRoutes from './routes/attendenceRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Base Test Route
app.get('/', (req, res) => {
    res.send("Attendance System API running perfectly.");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});