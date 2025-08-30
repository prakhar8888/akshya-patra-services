import express from 'express';
import { createSector, getAllSectors } from '../controllers/sectorController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Best Practice: Chain HTTP methods for the same route for better readability.
router.route('/')
  // All authenticated users can view sectors
  .get(protect, getAllSectors)
  // Only Admins (and Super Admins) can create new sectors
  .post(protect, admin, createSector);

export default router;
