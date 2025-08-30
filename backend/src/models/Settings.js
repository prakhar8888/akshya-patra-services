import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    // We use a key to ensure we only ever have one settings document in the database.
    // This is a "singleton" pattern for database configuration.
    key: {
      type: String,
      default: 'global',
      unique: true,
      required: true,
    },
    // If true, new admin sign-ups are automatically approved without needing Super Admin review.
    permanentApprovalMode: {
      type: Boolean,
      default: false,
    },
    // If true, certain sensitive candidate information might be hidden from lower-level roles.
    confidentialityMode: {
      type: Boolean,
      default: true,
    },
    // We can add more global settings here in the future
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
