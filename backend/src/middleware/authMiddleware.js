import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import chalk from 'chalk';

/**
 * Middleware to protect routes by verifying the JWT token.
 * This is the first line of defense for any secure endpoint.
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and is a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the JWT_SECRET from our environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user associated with the token's ID from the database.
      // We exclude the password for security.
      // CRITICAL: Fetching the user on each request ensures that any changes
      // to the user's status or role are immediately reflected.
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user || req.user.status !== 'active') {
        return res.status(401).json({ message: 'Not authorized, user not found or inactive.' });
      }

      // If everything is valid, proceed to the next middleware or the controller
      next();
    } catch (error) {
      console.error(chalk.red('Authentication error:'), error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

/**
 * A higher-order function to create role-based authorization middleware.
 * @param {string[]} allowedRoles - An array of roles that are allowed to access the route.
 */
const checkRole = (allowedRoles) => (req, res, next) => {
  // This middleware should run AFTER the 'protect' middleware, so `req.user` will be available.
  if (req.user && allowedRoles.includes(req.user.role)) {
    next(); // Role is allowed, proceed to the next middleware/controller
  } else {
    res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions.' });
  }
};

// --- HIERARCHICAL ROLE MIDDLEWARE ---
// We define middleware for each level. Higher levels include the roles below them.
// This makes the system more flexible and easier to manage.

// Recruiters are the base level for HR tasks.
export const recruiter = checkRole(['recruiter', 'hr-manager', 'admin', 'super-admin']);

// HR Managers can do everything a recruiter can.
export const hrManager = checkRole(['hr-manager', 'admin', 'super-admin']);

// Admins can do everything an HR Manager can.
export const admin = checkRole(['admin', 'super-admin']);

// Super Admins have ultimate power.
export const superAdmin = checkRole(['super-admin']);

