import express from 'express';
import { markEntry, markExit, getAllAttendance } from '../controllers/attendenceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student-focused actions (Must be authenticated)
router.post('/entry', protect, authorize('student'), markEntry);
router.put('/exit', protect, authorize('student'), markExit);

// Admin-focused actions (Must be authenticated AND have the 'admin' role)
router.get('/admin/all', protect, authorize('admin'), getAllAttendance);

export default router;                        