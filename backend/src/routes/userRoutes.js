import express from 'express';
import {
  getAllUsers,
  getHrUsers,
  deleteUser,
  updateUser,
  approveUser,
  rejectUser
} from '../controllers/userController.js';
import { protect, admin, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Top-level routes ---
// Super Admin gets all users
router.route('/').get(protect, superAdmin, getAllUsers);
// Admin can get a list of HR-level users
router.route('/hr').get(protect, admin, getHrUsers);


// --- Routes for specific users by ID ---

// Best Practice: Chain methods for the same route for better readability
router.route('/:id')
  .put(protect, superAdmin, updateUser)
  .delete(protect, superAdmin, deleteUser);

// Routes for the approval workflow
router.route('/:id/approve').put(protect, superAdmin, approveUser);
router.route('/:id/reject').put(protect, superAdmin, rejectUser);

export default router;
