// src/models/UserPreferences.js
import mongoose from 'mongoose';

const UserPreferencesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    layoutPreset: {
      type: String,
      enum: ['compact', 'spacious'],
      default: 'spacious',
    },
    // Key-value store for widget visibility and order on dashboards
    widgets: {
      type: Map,
      of: new mongoose.Schema({
        isVisible: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
      }),
      default: {},
    },
    notificationPrefs: {
      email: {
        approvals: { type: Boolean, default: true },
        escalations: { type: Boolean, default: true },
        dailySummary: { type: Boolean, default: false }, // 🔥 fixed here
      },
      push: {
        approvals: { type: Boolean, default: true },
        escalations: { type: Boolean, default: true },
      },
    },
    // Allows an admin to browse without their actions being fully logged (can be disabled by SA)
    adminPassiveMode: {
      type: Boolean,
      default: false,
    },
    // Allows users to "watch" specific candidates, jobs, etc.
    watchlists: {
      candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
      jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    },
  },
  { timestamps: true }
);

const UserPreferences = mongoose.model('UserPreferences', UserPreferencesSchema);

export default UserPreferences;
