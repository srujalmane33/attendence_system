import express from 'express';
import {
    markEntry,
    markExit,
    getMyAttendanceLogs,
    getAllAttendance
} from '../controllers/attendenceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student-focused actions (Must be authenticated and authorized as a student)
router.post('/entry', protect, authorize('student'), markEntry);
router.put('/exit', protect, authorize('student'), markExit);

// THE FIX: Active student personal history logs route (allows both student & user roles)
router.get('/my-logs', protect, authorize('student', 'user'), getMyAttendanceLogs);

// Admin-focused actions (Must be authenticated AND have the 'admin' role)
router.get('/admin/all', protect, authorize('admin'), getAllAttendance);

export default router;