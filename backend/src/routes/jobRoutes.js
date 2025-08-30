import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobsForAdmin, // Import the new function
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to get all open jobs
// Admin route to create a new job
router.route('/').get(getAllJobs).post(protect, admin, createJob);

// Admin route to get a paginated list of ALL jobs
router.route('/admin/all').get(protect, admin, getJobsForAdmin);

// Admin routes to update and delete a specific job
router.route('/:id').put(protect, admin, updateJob).delete(protect, admin, deleteJob);

export default router;
