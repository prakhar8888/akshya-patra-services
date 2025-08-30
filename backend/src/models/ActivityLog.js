import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Can be null for system actions like a candidate applying
      index: true, // Index for faster querying of a specific user's activities
    },
    action: {
      type: String,
      required: true,
      index: true, // Index for faster filtering by action type (e.g., 'USER_LOGIN')
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Use Mixed type to store structured JSON data
      default: {},
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
