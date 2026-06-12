import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Route for handling account creation (Student/Admin registration)
// POST -> http://localhost:3000/api/auth/register
router.post('/register', registerUser);

// Route for handling system access validations
// POST -> http://localhost:3000/api/auth/login
router.post('/login', loginUser);



import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: { in: ['student', 'user'] }
      }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Database query failed:", error);
    return res.status(500).json({ message: "Failed to read database records." });
  }
});

export default router;