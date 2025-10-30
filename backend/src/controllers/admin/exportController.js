// src/controllers/admin/exportController.js
import ExportJob from '../../models/ExportJob.js';
import ApprovalTicket from '../../models/ApprovalTicket.js';
import AdminConfig from '../../models/AdminConfig.js';
import { logActivity } from '../../services/activityLogService.js';
import chalk from 'chalk';

/**
 * @desc    Request a new data export
 * @route   POST /api/admin/exports/request
 * @access  Private/Admin
 */
export const requestExport = async (req, res) => {
  const { exportType, format, purpose } = req.body;
  const requesterId = req.user._id;

  if (!exportType || !format || !purpose) {
    return res.status(400).json({ message: 'Export type, format, and purpose are required.' });
  }

  try {
    const adminConfig = await AdminConfig.findOne();
    const needsApproval = adminConfig?.governance?.exportRequiresApproval || false;

    const newExportJob = new ExportJob({
      requester: requesterId,
      exportType,
      format,
      purpose,
      status: needsApproval ? 'pending_approval' : 'queued',
    });

    await newExportJob.save();

    let message = `Export job for '${exportType}' data created and is now queued for processing.`;

    if (needsApproval) {
      const approvalTicket = new ApprovalTicket({
        requester: requesterId,
        subject: `Data Export Request: ${exportType}`,
        description: `User ${req.user.name} has requested to export ${exportType} data in ${format} format for the purpose of: "${purpose}".`,
        type: 'DATA_EXPORT',
        relatedResource: newExportJob._id,
        relatedModel: 'ExportJob',
      });
      await approvalTicket.save();

      await logActivity(
        requesterId,
        'EXPORT_REQUEST_PENDING',
        `Requested to export ${exportType} data. Purpose: ${purpose}. Awaiting approval.`
      );

      message = `Export job for '${exportType}' data has been created but requires Super Admin approval before processing.`;
    } else {
      await logActivity(
        requesterId,
        'EXPORT_REQUEST_QUEUED',
        `Requested and queued an export of ${exportType} data. Purpose: ${purpose}.`
      );
    }

    console.log(chalk.green(`📤 New export request by ${req.user.email}. Needs Approval: ${needsApproval}`));
    res.status(201).json({ message, job: newExportJob });

  } catch (error) {
    console.error(chalk.red('❌ Error requesting data export:', error.message));
    res.status(500).json({ message: 'Server error while requesting data export.' });
  }
};

/**
 * @desc    Get all export jobs
 * @route   GET /api/admin/exports
 * @access  Private/SuperAdmin
 */
export const getAllExportJobs = async (req, res) => {
  try {
    const jobs = await ExportJob.find()
      .populate('requester', 'name email')
      .sort({ createdAt: -1 });

    console.log(chalk.cyan('✅ Successfully fetched all export jobs.'));
    res.status(200).json(jobs);
  } catch (error) {
    console.error(chalk.red('❌ Error fetching export jobs:', error.message));
    res.status(500).json({ message: 'Server error while fetching export jobs.' });
  }
};
