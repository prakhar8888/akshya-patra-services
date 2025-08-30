import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema(
  {
    // Link to the candidate who received the email
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Candidate',
      index: true, // CRITICAL: Index for fast retrieval of logs per candidate
    },
    // Link to the HR user who sent the email
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Email details
    subject: {
      type: String,
      required: [true, 'Email subject is required.'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Email body is required.'],
    },
    // New field to track the status of the email
    status: {
      type: String,
      required: true,
      // This enum perfectly matches the asynchronous controller logic
      enum: ['Queued', 'Sent', 'Failed'],
      default: 'Queued',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

export default EmailLog;
