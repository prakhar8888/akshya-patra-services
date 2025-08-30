import express from 'express';
import { createCallLog, getCallLogsForCandidate } from '../controllers/callLogController.js';
// Correctly import 'hrManager' instead of 'hr'
import { protect, hrManager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, hrManager, createCallLog);

router.route('/:candidateId')
  .get(protect, hrManager, getCallLogsForCandidate);

export default router;
