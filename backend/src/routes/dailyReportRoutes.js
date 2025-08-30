import express from 'express';
import {
  submitDailyReport,
  getAllDailyReports,
  updateReportStatus,
} from '../controllers/dailyReportController.js';
// Correctly import 'hrManager' and 'admin'
import { protect, hrManager, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, hrManager, submitDailyReport)
  .get(protect, admin, getAllDailyReports);

router.route('/:id/status')
  .put(protect, admin, updateReportStatus);

export default router;
