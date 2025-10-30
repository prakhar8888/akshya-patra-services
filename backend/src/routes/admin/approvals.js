// backend/src/routes/admin/approvals.js
import express from 'express';
import {
  getPendingApprovals,
  getApprovalTicketById,
  updateApprovalStatus,
} from '../../controllers/admin/approvalController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { admin } from '../../middleware/rbac.js';

const router = express.Router();

// @desc    Get all tickets with a 'pending' status
// @route   GET /api/admin/approvals/pending
// @access  Private/Admin
router.get('/pending', protect, admin, getPendingApprovals);

// @desc    Get a single approval ticket by ID
// @route   GET /api/admin/approvals/:id
// @access  Private/Admin
router.get('/:id', protect, admin, getApprovalTicketById);

// @desc    Process a ticket (approve or reject)
// @route   PUT /api/admin/approvals/:id/process
// @access  Private/Admin
router.put('/:id/process', protect, admin, updateApprovalStatus);

export default router;
