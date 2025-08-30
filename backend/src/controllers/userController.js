import User from '../models/User.js';
import { logActivity } from '../services/activityLogService.js';
import sendEmail from '../services/emailService.js';
import chalk from 'chalk';

/**
 * @desc    Get all users with pagination (for Super Admin)
 * @route   GET /api/users
 * @access  Private (Super Admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const count = await User.countDocuments({ role: { $ne: 'super-admin' } });
    const users = await User.find({ role: { $ne: 'super-admin' } })
      .select('-password')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.status(200).json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(chalk.red.bold('Error in getAllUsers:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all HR users with pagination (for Admin)
 * @route   GET /api/users/hr
 * @access  Private (Admin, Super Admin)
 */
export const getHrUsers = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const hrRoles = ['hr-manager', 'recruiter'];

    const count = await User.countDocuments({ role: { $in: hrRoles } });
    const users = await User.find({ role: { $in: hrRoles } })
      .select('-password')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

     res.status(200).json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(chalk.red.bold('Error in getHrUsers:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Approve a pending user account
 * @route   PUT /api/users/:id/approve
 * @access  Private (Super Admin only)
 */
export const approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user && user.status === 'pending') {
            user.status = 'active';
            const updatedUser = await user.save();

            await logActivity(req.user.id, 'USER_APPROVED', { approvedUserName: updatedUser.name });

            await sendEmail({
                to: updatedUser.email,
                subject: 'Your Account has been Approved!',
                body: `<p>Hello ${updatedUser.name},</p><p>Your account for the Akshaya Patra Services HRMS has been approved. You can now log in.</p>`,
            });

            console.log(chalk.green(`User account for ${updatedUser.name} approved by ${req.user.name}`));
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'Pending user not found' });
        }
    } catch (error) {
        console.error(chalk.red.bold('Error in approveUser:'), error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Reject a pending user account (Soft Delete)
 * @route   PUT /api/users/:id/reject
 * @access  Private (Super Admin only)
 */
export const rejectUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user && user.status === 'pending') {
            user.status = 'rejected'; // Soft delete by changing status
            const updatedUser = await user.save();

            await logActivity(req.user.id, 'USER_REJECTED', { rejectedUserName: updatedUser.name });

            await sendEmail({
                to: updatedUser.email,
                subject: 'Your Account Request Status',
                body: `<p>Hello ${updatedUser.name},</p><p>We regret to inform you that your request for an account on the Akshaya Patra Services HRMS has been denied.</p>`,
            });

            console.log(chalk.yellow(`User account for ${updatedUser.name} rejected by ${req.user.name}`));
            res.status(200).json({ message: 'User rejected successfully' });
        } else {
            res.status(404).json({ message: 'Pending user not found' });
        }
    } catch (error) {
        console.error(chalk.red.bold('Error in rejectUser:'), error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Update a user's details
 * @route   PUT /api/users/:id
 * @access  Private (Super Admin only)
 */
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const oldRole = user.role;

      // --- Enterprise Security: Prevent Super Admin from changing their own role ---
      if (user.role === 'super-admin' && req.body.role && req.body.role !== 'super-admin') {
          return res.status(400).json({ message: 'Cannot change the role of a Super Admin account.' });
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      // --- Detailed Activity Logging for Auditing ---
      const logDetails = { updatedUserName: updatedUser.name };
      if (oldRole !== updatedUser.role) {
          logDetails.roleChange = { from: oldRole, to: updatedUser.role };
      }
      await logActivity(req.user.id, 'USER_UPDATED', logDetails);

      console.log(chalk.blue(`User details for ${updatedUser.name} updated by ${req.user.name}`));
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(chalk.red.bold('Error in updateUser:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Delete a user (Soft Delete)
 * @route   DELETE /api/users/:id
 * @access  Private (Super Admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'super-admin') {
        return res.status(400).json({ message: 'Cannot delete a Super Admin account.' });
      }

      user.status = 'inactive'; // Soft delete by changing status
      await user.save();

      await logActivity(req.user.id, 'USER_DEACTIVATED', { deactivatedUserName: user.name });

      console.log(chalk.yellow(`User account for ${user.name} deactivated by ${req.user.name}`));
      res.status(200).json({ message: 'User deactivated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(chalk.red.bold('Error in deleteUser:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
