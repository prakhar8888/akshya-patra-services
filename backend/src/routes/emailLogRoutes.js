import express from 'express';
import { sendAndLogEmail, getEmailLogsForCandidate } from '../controllers/emailLogController.js';
// Correctly import 'hrManager' instead of 'hr'
import { protect, hrManager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/send')
    .post(protect, hrManager, sendAndLogEmail);

router.route('/:candidateId')
    .get(protect, hrManager, getEmailLogsForCandidate);

export default router;
