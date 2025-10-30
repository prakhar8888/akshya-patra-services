import mongoose from 'mongoose';

/**
 * ENTERPRISE FEATURE: EscalationTicket Model
 * This schema stores records of approval tickets that have been escalated, either
 * automatically due to an SLA breach or manually by an administrator. This creates
 * a clear audit trail for delayed or problematic approvals.
 */
const escalationTicketSchema = new mongoose.Schema(
  {
    originalTicketId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'ApprovalTicket', // Direct link to the ticket that was escalated
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      enum: [
        'SLA_BREACH', // Escalated automatically by the system
        'MANUAL_ESCALATION', // Escalated manually by an admin
        'OTHER',
      ],
    },
    escalatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // The user who manually escalated it, or null for system escalations
    },
    status: {
      type: String,
      required: true,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    resolutionDetails: {
      type: String,
      trim: true,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const EscalationTicket = mongoose.model('EscalationTicket', escalationTicketSchema);

export default EscalationTicket;
