// src/routes/admin/escalations.js
import express from 'express';
import { getAllEscalationTickets, createEscalationTicket } from '../../controllers/admin/escalationController.js';
import { protect } from '../../middleware/authMiddleware.js';
import { admin, superAdmin } from '../../middleware/rbac.js';

const router = express.Router();

// @route   /api/admin/escalations

// Get all escalation tickets (Super Admin only)
router.get('/', protect, superAdmin, getAllEscalationTickets);

// Manually create an escalation ticket (Admin and above)
router.post('/', protect, admin, createEscalationTicket);

export default router;
