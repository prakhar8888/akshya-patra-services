import DailyReport from '../models/DailyReport.js';
import { logActivity } from '../services/activityLogService.js';
import chalk from 'chalk';

/**
 * @desc    Submit a new daily report
 * @route   POST /api/reports
 * @access  Private (hr-manager)
 */
export const submitDailyReport = async (req, res) => {
  const { reportDate, summary, resumesUploaded, callsMade, candidatesJoined } = req.body;

  try {
    // --- Enterprise-level Validation: Prevent duplicate reports ---
    const startOfDay = new Date(reportDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(reportDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingReport = await DailyReport.findOne({
      hrManager: req.user.id,
      reportDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingReport) {
      return res.status(400).json({ message: 'A report for this date has already been submitted.' });
    }

    const report = new DailyReport({
      hrManager: req.user.id,
      reportDate,
      summary,
      resumesUploaded,
      callsMade,
      candidatesJoined,
    });

    const createdReport = await report.save();

    // --- Structured Activity Logging ---
    await logActivity(req.user.id, 'REPORT_SUBMITTED', {
        reportId: createdReport._id,
        reportDate: new Date(reportDate).toLocaleDateString()
    });

    console.log(chalk.green(`Daily report submitted by ${req.user.name} for ${new Date(reportDate).toLocaleDateString()}`));
    res.status(201).json(createdReport);
  } catch (error) {
    console.error(chalk.red.bold('Error in submitDailyReport:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all daily reports with pagination
 * @route   GET /api/reports
 * @access  Private (Admin, Super Admin)
 */
export const getAllDailyReports = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const count = await DailyReport.countDocuments();
    const reports = await DailyReport.find({})
      .populate('hrManager', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ reportDate: -1 });

    res.status(200).json({
      reports,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(chalk.red.bold('Error in getAllDailyReports:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Update a report's status (Approve/Reject)
 * @route   PUT /api/reports/:id/status
 * @access  Private (Admin, Super Admin)
 */
export const updateReportStatus = async (req, res) => {
  const { status } = req.body;

  // --- Enterprise-level Validation ---
  const validStatuses = ['Approved', 'Rejected'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided.' });
  }

  try {
    const report = await DailyReport.findById(req.params.id).populate('hrManager', 'name');

    if (report) {
      report.status = status;
      const updatedReport = await report.save();

      // --- Structured Activity Logging ---
      await logActivity(req.user.id, 'REPORT_STATUS_CHANGED', {
          reportId: report._id,
          hrManagerName: report.hrManager.name,
          newStatus: status
      });

      console.log(chalk.blue(`Report ${report._id} status changed to ${status} by ${req.user.name}`));
      res.status(200).json(updatedReport);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    console.error(chalk.red.bold('Error in updateReportStatus:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
