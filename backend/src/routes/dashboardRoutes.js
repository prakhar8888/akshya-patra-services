import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
// Correctly import 'hrManager' instead of 'hr'
import { protect, hrManager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/stats').get(protect, hrManager, getDashboardStats);

export default router;
