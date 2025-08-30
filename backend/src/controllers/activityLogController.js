import ActivityLog from '../models/ActivityLog.js';
import chalk from 'chalk';

/**
 * @desc    Get all activity logs with pagination
 * @route   GET /api/activity-logs
 * @access  Private (Admin, Super Admin)
 */
export const getAllActivityLogs = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 15; // Default to 15 logs per page
    const page = parseInt(req.query.page) || 1;

    const count = await ActivityLog.countDocuments();
    const logs = await ActivityLog.find({})
      .populate('user', 'name role') // Show the name and role of the user who performed the action
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 }); // Sort by most recent first

    res.status(200).json({
      logs,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(chalk.red.bold('Error in getAllActivityLogs:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
