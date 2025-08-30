import express from 'express';
import { createNote, getNotesForCandidate } from '../controllers/noteController.js';
// Correctly import 'hrManager' instead of 'hr'
import { protect, hrManager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, hrManager, createNote);

router.route('/:candidateId')
    .get(protect, hrManager, getNotesForCandidate);

export default router;
