import mongoose from 'mongoose';

const dailyReportSchema = new mongoose.Schema(
  {
    // Link to the HR user who submitted the report
    hrManager: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The date the report is for
    reportDate: {
      type: Date,
      required: true,
    },
    // Summary of the day's work
    summary: {
      type: String,
      required: [true, 'A summary of the day\'s work is required.'],
      trim: true,
    },
    // Key metrics for the day
    resumesUploaded: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Cannot have negative uploads.'], // Data Integrity
    },
    callsMade: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Cannot have negative calls.'], // Data Integrity
    },
    candidatesJoined: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Cannot have negative joins.'], // Data Integrity
    },
    status: {
      type: String,
      enum: ['Submitted', 'Approved', 'Rejected'],
      default: 'Submitted',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// --- Enterprise-level Indexing for Performance & Uniqueness ---
// This ensures a user can only submit one report per day and makes lookups faster.
dailyReportSchema.index({ hrManager: 1, reportDate: 1 }, { unique: true });


const DailyReport = mongoose.model('DailyReport', dailyReportSchema);

export default DailyReport;
