import Settings from '../models/Settings.js';
import { logActivity } from '../services/activityLogService.js';
import chalk from 'chalk';

/**
 * @desc    Get the global application settings
 * @route   GET /api/settings
 * @access  Private (Super Admin)
 */
export const getSettings = async (req, res) => {
  try {
    // Find the single settings document. If it doesn't exist, create it with default values.
    let settings = await Settings.findOne({ key: 'global' });
    if (!settings) {
      console.log(chalk.yellow('No global settings found. Creating with default values.'));
      settings = await Settings.create({ key: 'global' });
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error(chalk.red.bold('Error in getSettings:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Update the global application settings
 * @route   PUT /api/settings
 * @access  Private (Super Admin)
 */
export const updateSettings = async (req, res) => {
  const { permanentApprovalMode, confidentialityMode } = req.body;

  // --- Enterprise-level Validation: Ensure incoming data is of the correct type ---
  if (typeof permanentApprovalMode !== 'boolean' || typeof confidentialityMode !== 'boolean') {
    return res.status(400).json({ message: 'Invalid data type for settings. Boolean values are required.' });
  }

  try {
    // Find the single settings document and update it. `upsert: true` creates it if it doesn't exist.
    const updatedSettings = await Settings.findOneAndUpdate(
      { key: 'global' },
      { permanentApprovalMode, confidentialityMode },
      { new: true, upsert: true } // `new: true` returns the updated doc
    );

    // --- Structured Activity Logging for Audit Trail ---
    await logActivity(req.user.id, 'SETTINGS_UPDATED', {
        settings: {
            permanentApprovalMode,
            confidentialityMode,
        }
    });

    console.log(chalk.blue(`Global settings updated by ${req.user.name}`));
    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error(chalk.red.bold('Error in updateSettings:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
