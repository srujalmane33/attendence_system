import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Route for handling account creation (Student/Admin registration)
// POST -> http://localhost:3000/api/auth/register
router.post('/register', registerUser);

// Route for handling system access validations
// POST -> http://localhost:3000/api/auth/login
router.post('/login', loginUser);

export default router;