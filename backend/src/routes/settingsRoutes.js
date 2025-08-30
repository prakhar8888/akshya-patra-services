import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Best Practice: Chain HTTP methods for the same route for better readability.
// These routes are protected to ensure only Super Admins can access them.
router.route('/')
  .get(protect, superAdmin, getSettings)
  .put(protect, superAdmin, updateSettings);

export default router;
