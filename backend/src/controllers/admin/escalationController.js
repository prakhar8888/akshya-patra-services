// src/controllers/admin/escalationController.js
import EscalationTicket from '../../models/EscalationTicket.js';
import ApprovalTicket from '../../models/ApprovalTicket.js';
import { logActivity } from '../../services/activityLogService.js';
import chalk from 'chalk';

/**
 * @desc    Get all escalation tickets (for Super Admin)
 * @route   GET /api/admin/escalations
 * @access  Private/SuperAdmin
 */
export const getAllEscalationTickets = async (req, res) => {
  try {
    const tickets = await EscalationTicket.find()
      .populate('originalTicketId', 'requester subject status')
      .populate('escalatedBy', 'name email')
      .sort({ createdAt: -1 });

    console.log(chalk.cyan('✅ Successfully fetched all escalation tickets.'));
    res.status(200).json(tickets);
  } catch (error) {
    console.error(chalk.red('❌ Error fetching escalation tickets:', error.message));
    res.status(500).json({ message: 'Server error while fetching escalation tickets.' });
  }
};

/**
 * @desc    Manually create an escalation ticket
 * @route   POST /api/admin/escalations
 * @access  Private/Admin
 */
export const createEscalationTicket = async (req, res) => {
  const { originalTicketId, reason } = req.body;

  if (!originalTicketId || !reason) {
    return res.status(400).json({ message: 'Original ticket ID and reason are required.' });
  }

  try {
    const originalTicket = await ApprovalTicket.findById(originalTicketId);
    if (!originalTicket) {
      return res.status(404).json({ message: 'Original approval ticket not found.' });
    }

    const newEscalation = new EscalationTicket({
      originalTicketId,
      reason,
      escalatedBy: req.user._id,
      status: 'open',
    });

    await newEscalation.save();

    // Update the original ticket to show it has been escalated
    originalTicket.status = 'escalated';
    await originalTicket.save();

    await logActivity(
      req.user._id,
      'ESCALATION_CREATED',
      `Manually escalated approval ticket: ${originalTicket._id}. Reason: ${reason}`
    );

    console.log(chalk.green(`🎉 New escalation ticket created for approval ticket ${originalTicketId}.`));
    res.status(201).json(newEscalation);
  } catch (error) {
    console.error(chalk.red('❌ Error creating escalation ticket:', error.message));
    res.status(500).json({ message: 'Server error while creating escalation ticket.' });
  }
};
