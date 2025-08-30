import express from 'express';
import { createDesignation, getAllDesignations } from '../controllers/designationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Best Practice: Chain HTTP methods for the same route for better readability.
router.route('/')
  // All authenticated users can view designations
  .get(protect, getAllDesignations)
  // Only Admins (and Super Admins) can create new designations
  .post(protect, admin, createDesignation);

export default router;
