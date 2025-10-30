import express from 'express';
import {
  createDelegation,
  getActiveDelegations,
  revokeDelegation,
} from '../../controllers/admin/delegationController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { admin } from '../../middleware/rbac.js';

const router = express.Router();

// @desc    Get all active delegations for the organization
// @route   GET /api/admin/delegations
// @access  Private/Admin
router.get('/', protect, admin, getActiveDelegations);

// @desc    Create a new delegation of authority
// @route   POST /api/admin/delegations
// @access  Private/Admin
router.post('/', protect, admin, createDelegation);

// @desc    Revoke an active delegation
// @route   PUT /api/admin/delegations/:id/revoke
// @access  Private/Admin
router.put('/:id/revoke', protect, admin, revokeDelegation);

export default router;

