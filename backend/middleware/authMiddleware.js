import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

/**
 * Protect Middleware
 * Locks down secure endpoints by verifying the incoming Bearer JWT.
 * Automatically attaches the authenticated user profile to the request object.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if the request contains a Bearer token in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the raw token string (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the token using the secret key from the environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the corresponding user document from MongoDB Atlas via Prisma Client
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user) {
        return res.status(401).json({ message: 'Authorization rejected: User no longer exists.' });
      }

      // Safely delete the hashed password from the user object before sending it down the pipeline
      delete user.password;

      // Attach user profile metadata dynamically to the request context
      req.user = user;
      
      return next();
    } catch (error) {
      console.error('Session Token Validation Failure:', error.message);
      return res.status(401).json({ message: 'Session validation failed. Please log in again.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied: No authentication token found.' });
  }
};

/**
 * Authorize Middleware
 * Restricts access to specific security clearance levels (e.g., stopping students from accessing admin panels).
 * Must be chained AFTER the 'protect' middleware.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(501).json({ message: 'Authorization error: User context was not loaded.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Accounts with the role of "${req.user.role}" do not have permission to view this resource.`
      });
    }
    
    return next();
  };
};