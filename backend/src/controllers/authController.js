import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import chalk from 'chalk';
import { logActivity } from '../services/activityLogService.js';

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (admin/hr created by super-admin)
// @route   POST /api/auth/register
// @access  Private/Admin
export const registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
    const user = await User.create({ name, email, password, role, status: 'active' });

    if (user) {
      logActivity(req.user.id, 'USER_CREATED', { createdUserName: user.name, createdUserRole: user.role });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.status !== 'active') {
        console.log(chalk.yellow(`Login attempt for non-active user: ${email} (Status: ${user.status})`));
        res.status(403);
        throw new Error(`Your account is currently ${user.status}. Please contact an administrator.`);
      }

      console.log(chalk.green(`User logged in successfully: ${email}`));
      logActivity(user._id, 'USER_LOGIN', {});

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Handle successful Google auth and send token to frontend
// @route   GET /api/auth/success
// @access  Private (redirect from passport)
export const googleAuthSuccess = (req, res) => {
  if (req.user) {
    if (req.user.status !== 'active') {
      return res.redirect(`${process.env.FRONTEND_URL}/login?status=${req.user.status}`);
    }
    const token = generateToken(req.user._id);
    logActivity(req.user._id, 'USER_LOGIN_GOOGLE', {});
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
  } else {
    res.redirect(`${process.env.FRONTEND_URL}/login?status=failed`);
  }
};


// @desc    Get current user's profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        // req.user is attached by the 'protect' middleware, so we have the user's ID.
        // We fetch the full user document to ensure we have the most up-to-date information.
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

