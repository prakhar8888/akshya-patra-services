import CallLog from '../models/CallLog.js';
import Candidate from '../models/Candidate.js';
import { logActivity } from '../services/activityLogService.js';
import chalk from 'chalk';

/**
 * @desc    Create a new call log for a candidate
 * @route   POST /api/call-logs
 * @access  Private (Recruiter, HR, Admin, Super Admin)
 */
export const createCallLog = async (req, res) => {
  const { candidateId, callDuration, outcome, notes } = req.body;

  // --- Enterprise-level Validation ---
  if (!candidateId || !outcome) {
    return res.status(400).json({ message: 'Candidate ID and outcome are required.' });
  }

  try {
    // Check if the candidate exists to ensure data integrity
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const callLog = new CallLog({
      candidate: candidateId,
      hrManager: req.user.id, // Get the logged-in user's ID
      callDuration,
      outcome,
      notes,
    });

    const createdCallLog = await callLog.save();

    // --- Activity Logging for Audit Trail ---
    await logActivity(req.user.id, 'CALL_LOGGED', {
      candidateName: candidate.name,
      callOutcome: outcome
    });

    console.log(chalk.green(`Call logged for candidate ${candidate.name} by ${req.user.name}`));
    res.status(201).json(createdCallLog);
  } catch (error) {
    console.error(chalk.red.bold('Error in createCallLog:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all call logs for a specific candidate
 * @route   GET /api/call-logs/:candidateId
 * @access  Private (Recruiter, HR, Admin, Super Admin)
 */
export const getCallLogsForCandidate = async (req, res) => {
  try {
    const callLogs = await CallLog.find({ candidate: req.params.candidateId })
      .populate('hrManager', 'name') // Show the name of the HR manager
      .sort({ createdAt: -1 }); // Show the most recent calls first

    res.status(200).json(callLogs);
  } catch (error) {
    console.error(chalk.red.bold('Error in getCallLogsForCandidate:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
