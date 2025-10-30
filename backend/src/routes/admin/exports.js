// src/routes/admin/exports.js
import express from 'express';
import {
  requestExport,
  getAllExportJobs,
} from '../../controllers/admin/exportController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { admin, superAdmin } from '../../middleware/rbac.js';

const router = express.Router();

// @route   /api/admin/exports

// ✅ Request a new data export (Admin and above)
router.post('/request', protect, admin, requestExport);

// ✅ Get a list of all export jobs (Super Admin only)
router.get('/', protect, superAdmin, getAllExportJobs);

export default router;
