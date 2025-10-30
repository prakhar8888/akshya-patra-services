import mongoose from 'mongoose';

const approvalHistorySchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['created', 'approved', 'rejected', 'reassigned'],
    required: true,
  },
  comment: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ApprovalTicketSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  approver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resourceType: {
    type: String,
    required: true,
    enum: ['DailyReport', 'JobCreation', 'UserApproval', 'DataExport'],
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  history: [approvalHistorySchema],
}, { timestamps: true });

ApprovalTicketSchema.pre('save', function (next) {
  if (this.isNew) {
    this.history.push({
      actor: this.requester,
      action: 'created',
      comment: 'Ticket automatically generated for approval.',
    });
  }
  next();
});

const ApprovalTicket = mongoose.model('ApprovalTicket', ApprovalTicketSchema);

export default ApprovalTicket;
