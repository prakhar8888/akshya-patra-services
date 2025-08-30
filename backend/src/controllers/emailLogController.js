import EmailLog from '../models/EmailLog.js';
import Candidate from '../models/Candidate.js';
import sendEmail from '../services/emailService.js';
import { logActivity } from '../services/activityLogService.js';
import chalk from 'chalk';

/**
 * @desc    Queue an email to a candidate and log it
 * @route   POST /api/emails/send
 * @access  Private (hr-manager and above)
 */
export const sendAndLogEmail = async (req, res) => {
  const { candidateId, subject, body } = req.body;
  const senderId = req.user.id;

  // --- Enterprise-level Validation ---
  if (!candidateId || !subject || !body) {
    return res.status(400).json({ message: 'Candidate ID, subject, and body are required.' });
  }

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // --- Performance Best Practice: Respond Immediately ---
    // 1. Create the log first with a 'Queued' status.
    const emailLog = new EmailLog({
      recipient: candidateId,
      sender: senderId,
      subject,
      body,
      status: 'Queued',
    });
    await emailLog.save();

    // 2. Log the action for the audit trail.
    await logActivity(senderId, 'EMAIL_QUEUED', {
      candidateName: candidate.name,
      emailSubject: subject
    });

    // 3. Send an immediate success response to the user.
    res.status(200).json({ message: 'Email has been queued for sending.' });
    console.log(chalk.blue(`Email to ${candidate.name} queued by ${req.user.name}.`));


    // --- Asynchronous Task: Send the email in the background ---
    try {
      await sendEmail({ to: candidate.email, subject, body });
      // Update the log to 'Sent' on success
      emailLog.status = 'Sent';
      await emailLog.save();
      console.log(chalk.green(`Email to ${candidate.name} sent successfully.`));
    } catch (sendError) {
      // Update the log to 'Failed' on failure
      emailLog.status = 'Failed';
      await emailLog.save();
      console.error(chalk.red(`Failed to send email to ${candidate.name}:`), sendError);
    }

  } catch (error) {
    console.error(chalk.red.bold('Error in sendAndLogEmail controller:'), error);
    // Don't send a response here as one might have already been sent.
    // The error is logged for the developer.
  }
};

/**
 * @desc    Get all email logs for a specific candidate
 * @route   GET /api/emails/:candidateId
 * @access  Private (hr-manager and above)
 */
export const getEmailLogsForCandidate = async (req, res) => {
  try {
    const emailLogs = await EmailLog.find({ recipient: req.params.candidateId })
      .populate('sender', 'name') // Show the name of the sender
      .sort({ createdAt: -1 }); // Show the most recent emails first

    res.status(200).json(emailLogs);
  } catch (error) {
    console.error(chalk.red.bold('Error in getEmailLogsForCandidate:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
