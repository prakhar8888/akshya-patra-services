import express from 'express';
import { getAllActivityLogs } from '../controllers/activityLogController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/activity-logs
// @desc    Get all activity logs
// @access  Private/Admin
router.get('/', protect, admin, getAllActivityLogs);

export default router;
