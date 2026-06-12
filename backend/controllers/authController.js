import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper function to generate a JWT using your secret key from the .env file
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (Student or Admin)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedRole = (role || 'student').toLowerCase().trim();

  try {
    // 1. Check if user already exists via Prisma
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 2. Encrypt/Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let assignedStudentId = null;
    const currentYear = new Date().getFullYear();

    // 3. Custom studentId generation logic to resolve Prisma unique constraints
    if (normalizedRole === 'student') {
      // Look for the last student registered this year
      const lastStudent = await prisma.user.findFirst({
        where: {
          role: 'student',
          studentId: { startsWith: `STU-${currentYear}` }
        },
        orderBy: { createdAt: 'desc' }
      });

      let sequenceNumber = 1;
      if (lastStudent && lastStudent.studentId) {
        // Break down "STU-2026-0001" -> extract "0001" -> parse to integer 1
        const parts = lastStudent.studentId.split('-');
        if (parts.length === 3) {
          const lastSequence = parseInt(parts[2], 10);
          if (!isNaN(lastSequence)) {
            sequenceNumber = lastSequence + 1;
          }
        }
      }

      // Pad sequence with leading zeros (e.g., 0001, 0002)
      const paddedSequence = String(sequenceNumber).padStart(4, '0');
      assignedStudentId = `STU-${currentYear}-${paddedSequence}`;
    } else {
      // 💡 THE UNIQUE CONSTRAINT RESOLUTION FOR ADMINS:
      // MongoDB treats multiple 'null' or empty values as duplicate keys under unique indexes.
      // To satisfy Prisma's @unique constraint safely, we generate a unique ADM format index!
      const uniqueTimestamp = Date.now().toString().slice(-6);
      assignedStudentId = `ADM-${currentYear}-${uniqueTimestamp}`;
    }

    // 4. Create the user in MongoDB via Prisma Client
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: normalizedRole,
        studentId: assignedStudentId
      }
    });

    if (user) {
      res.status(201).json({
        _id: user.id, // Mapped to maintain frontend structure consistency
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        token: generateToken(user.id)
      });
    }
  } catch (error) {
    console.error("EXACT REGISTER ERROR:", error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;
  const normalizedRole = (role || 'student').toLowerCase().trim();

  try {
    // 1. Find user by email via Prisma
    const user = await prisma.user.findUnique({ where: { email } });

    // 2. Critical Check: Ensure user exists AND the role they selected matches their DB role
    if (!user || user.role !== normalizedRole) {
      return res.status(401).json({ message: 'Invalid credentials or incorrect role selected' });
    }

    // 3. Verify password hash matches
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 4. Return user info along with their active session token
    res.json({
      _id: user.id, // Mapped to maintain frontend structure consistency
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};