import mongoose from 'mongoose';

/**
 * ENTERPRISE FEATURE: AdminConfig Model
 * This schema defines a Singleton document in the database. A Singleton means there will
 * only ever be ONE document of this type. It holds all global, system-wide configurations
 * that are managed by a Super Admin. This is a robust pattern for managing global settings.
 */
const adminConfigSchema = new mongoose.Schema(
  {
    // --- Governance Toggles ---
    governance: {
      pamEnabled: {
        type: Boolean,
        default: false, // Privileged Access Management. If true, sensitive actions require approval.
      },
      contentMaskingEnabled: {
        type: Boolean,
        default: false, // If true, PII is masked in previews and exports for non-privileged users.
      },
      exportRequiresApproval: {
        type: Boolean,
        default: true, // If true, all data exports must be approved by a Super Admin.
      }
    },

    // --- SLA (Service Level Agreement) Timings in Hours ---
    slaSettings: {
      approvalWarningHours: {
        type: Number,
        default: 24, // A pending approval will enter a "warning" state after 24 hours.
      },
      approvalBreachHours: {
        type: Number,
        default: 48, // An approval is considered "breached" after 48 hours, triggering an escalation.
      },
    },

    // --- Other potential settings can be added here in the future ---
    // For example: email templates, default user roles, etc.
  },
  {
    timestamps: true, // Tracks when the settings were last updated
  }
);

const AdminConfig = mongoose.model('AdminConfig', adminConfigSchema);

export default AdminConfig;
