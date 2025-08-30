import express from 'express';
import { authenticateUser } from '../controllers/pusherController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/pusher/auth
// @desc    Authenticate user for Pusher presence channel
// @access  Private
router.post('/auth', protect, authenticateUser);

export default router;
