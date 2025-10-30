import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    actionType: {
      type: String,
      required: true,
      enum: [
        // Auth Actions
        'USER_LOGIN', 'USER_REGISTER', 'USER_LOGOUT',
        // Candidate Actions
        'CANDIDATE_APPLY', 'CANDIDATE_STATUS_CHANGE', 'CANDIDATE_CREATE_HR', 'CANDIDATE_REVIEW_EDIT',
        // HR Actions
        'CALL_LOG_CREATED', 'EMAIL_LOG_CREATED', 'NOTE_CREATED',
        // Admin Actions
        'JOB_CREATED', 'JOB_UPDATED', 'JOB_DELETED',
        'USER_APPROVED', 'USER_REJECTED', 'USER_UPDATED', 'USER_DELETED',
        'SECTOR_CREATED', 'SECTOR_UPDATED', 'SECTOR_DELETED',
        'DESIGNATION_CREATED', 'DESIGNATION_UPDATED', 'DESIGNATION_DELETED',
        'REPORT_SUBMITTED', 'REPORT_STATUS_UPDATED',
        // Super Admin & Governance Actions
        'SETTINGS_UPDATED',
        'DELEGATION_CREATED', 'DELEGATION_REVOKED',
        'APPROVAL_TICKET_CREATED', 'APPROVAL_TICKET_PROCESSED',
        'ESCALATION_CREATED',
        'EXPORT_REQUEST_PENDING', 'EXPORT_REQUEST_QUEUED',
      ],
    },
    details: {
      type: String,
      required: true,
    },
    // --- NEW AUDIT FIELDS ---
    before: {
      type: mongoose.Schema.Types.Mixed, // Stores the state of an object BEFORE the change
    },
    after: {
      type: mongoose.Schema.Types.Mixed, // Stores the state of an object AFTER the change
    },
    par: {
      type: String, // Purpose, Authorization, and Reason for sensitive actions
    },
    immutable: {
      type: Boolean, // If true, this log entry cannot be modified or deleted
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure immutability for marked records
activityLogSchema.pre('updateOne', function (next) {
  if (this.immutable) {
    next(new Error('This activity log is immutable and cannot be changed.'));
  } else {
    next();
  }
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
