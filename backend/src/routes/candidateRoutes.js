import express from 'express';
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidateStatus,
  createCandidateFromHR,
  getReviewQueueCandidates, // Import the new function
} from '../controllers/candidateController.js';
import multer from 'multer';
import { protect, recruiter } from '../middleware/authMiddleware.js';

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });
const router = express.Router();


// --- PUBLIC ROUTE ---
// For candidates applying from the public website
router.post('/apply', upload.single('resume'), createCandidate);


// --- PROTECTED ROUTES (for Recruiters and above) ---

// Get all candidates (paginated) OR create a candidate manually from the HR panel
router.route('/')
  .get(protect, recruiter, getAllCandidates)
  .post(protect, recruiter, upload.single('resume'), createCandidateFromHR);

// Get the list of candidates needing manual review
router.route('/review-queue')
  .get(protect, recruiter, getReviewQueueCandidates);

// Get a single candidate by ID OR update their status
router.route('/:id')
  .get(protect, recruiter, getCandidateById)
  .put(protect, recruiter, updateCandidateStatus); // Note: A PUT to /:id could be used for full updates later

// A more specific route for just updating status
router.route('/:id/status')
  .put(protect, recruiter, updateCandidateStatus);


export default router;
