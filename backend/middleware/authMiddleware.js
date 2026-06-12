import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

// Middleware to lock down routes and verify the student/admin session token
export const protect = async (req, res, next) => {
  let token;

  // Check if the request contains a Bearer token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (Format: "Bearer <token_string>")
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the token using your JWT_SECRET from the .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user data linked to the token from Atlas via Prisma Client
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user no longer exists' });
      }

      // Safely strip out the sensitive password hash before passing user context forward
      delete user.password;

      // Attach user profile metadata to the global request pipeline
      req.user = user;
      
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, session token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Middleware to restrict access to specific roles (e.g., stopping students from viewing admin logs)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user.role}) is not authorized to access this resource`,
      });
    }
    next();
  };
};