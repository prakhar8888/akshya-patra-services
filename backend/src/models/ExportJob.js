import mongoose from 'mongoose';

/**
 * ENTERPRISE FEATURE: ExportJob Model
 * This schema creates an audit trail for all data export requests. It tracks who
 * requested the data, what they requested, why, and the current status of the job.
 * This is crucial for compliance and data governance.
 */
const exportJobSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    exportType: {
      type: String,
      required: true,
      enum: ['all_candidates', 'all_users', 'activity_logs', 'job_postings'],
    },
    format: {
      type: String,
      required: true,
      enum: ['csv', 'json'],
      default: 'csv',
    },
    status: {
      type: String,
      required: true,
      enum: [
        'pending_approval', // Waiting for a Super Admin to approve
        'queued',           // Approved and waiting to be processed
        'processing',       // The export is actively being generated
        'completed',        // The export file is ready for download
        'failed',           // The export job failed
        'rejected',         // The request was rejected
      ],
      default: 'queued',
    },
    purpose: {
      type: String,
      required: [true, 'A purpose is required for all data exports.'],
      trim: true,
    },
    fileUrl: {
      type: String, // Link to the generated export file in cloud storage
    },
    errorMessage: {
      type: String, // Stores any error message if the job fails
    },
  },
  {
    timestamps: true,
  }
);

const ExportJob = mongoose.model('ExportJob', exportJobSchema);

export default ExportJob;
