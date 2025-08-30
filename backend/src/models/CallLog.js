import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema(
  {
    // Link to the candidate who was called
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Candidate',
      index: true, // CRITICAL: Index for fast retrieval of logs per candidate
    },
    // Link to the HR user who made the call
    hrManager: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Call details
    callDuration: {
      type: Number, // Duration in seconds
      required: true,
      min: 0, // Data Integrity: Duration cannot be negative
    },
    outcome: {
      type: String,
      required: true,
      enum: ['Interested', 'Not Interested', 'No Answer', 'Follow Up Required', 'Wrong Number'],
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const CallLog = mongoose.model('CallLog', callLogSchema);

export default CallLog;
