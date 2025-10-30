// backend/src/controllers/admin/approvalController.js
import ApprovalTicket from '../../models/ApprovalTicket.js';
import User from '../../models/User.js';
import { logActivity } from '../../services/activityLogService.js';
import { ROLES } from '../../middleware/rbac.js';

// @desc    Get all pending approval tickets for the current user
// @route   GET /api/admin/approvals/pending
// @access  Private (Admins, Super Admins)
export const getPendingApprovals = async (req, res) => {
  try {
    const tickets = await ApprovalTicket.find({
      approver: req.user._id,
      status: 'pending',
    }).populate('requester', 'name email');

    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Get a single approval ticket by ID
// @route   GET /api/admin/approvals/:id
// @access  Private (Admins, Super Admins)
export const getApprovalTicketById = async (req, res) => {
  try {
    const ticket = await ApprovalTicket.findById(req.params.id)
      .populate('requester', 'name email')
      .populate('approver', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Approval ticket not found' });
    }

    if (ticket.approver.toString() !== req.user._id.toString() &&
        req.user.role !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({ message: 'Forbidden: You are not the designated approver for this ticket.' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error(`Error fetching approval ticket ${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Update the status of an approval ticket
// @route   PUT /api/admin/approvals/:id
// @access  Private (Admins, Super Admins)
export const updateApprovalStatus = async (req, res) => {
  const { status, comment } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided.' });
  }

  try {
    const ticket = await ApprovalTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Approval ticket not found.' });
    }

    if (ticket.status !== 'pending') {
      return res.status(400).json({ message: `This ticket has already been ${ticket.status}.` });
    }

    if (ticket.approver.toString() !== req.user._id.toString() &&
        req.user.role !== ROLES.SUPER_ADMIN) {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to process this ticket.' });
    }

    ticket.history.push({
      actor: req.user._id,
      action: status,
      comment: comment || 'No comment provided.',
    });

    ticket.status = status;
    await ticket.save();

    logActivity(req.user._id, 'approval_processed', `Approval ticket ${ticket._id} was ${status}.`);

    res.status(200).json({ message: `Ticket successfully ${status}.`, ticket });

  } catch (error) {
    console.error(`Error updating approval ticket ${req.params.id}:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
