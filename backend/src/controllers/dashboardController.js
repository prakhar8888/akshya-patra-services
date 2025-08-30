import Candidate from '../models/Candidate.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
import chalk from 'chalk';

/**
 * @desc    Get key stats for the admin/HR dashboard
 * @route   GET /api/dashboard/stats
 * @access  Private (hr-manager and above)
 */
export const getDashboardStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // --- Enterprise-level Aggregation Pipeline ---
    // This pipeline fetches all required stats in a single, efficient database query.
    const stats = await Candidate.aggregate([
      {
        $facet: {
          // Total number of candidates
          totalCandidates: [{ $count: 'count' }],
          // Candidates added in the last 30 days
          newCandidatesLast30Days: [
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            { $count: 'count' },
          ],
        },
      },
    ]);

    // Separately fetch job and user counts
    const openJobsCount = await Job.countDocuments({ status: 'Open' });
    const newJobsLast30Days = await Job.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const hrCount = await User.countDocuments({ role: { $in: ['hr-manager', 'recruiter'] } });

    // --- Format the response ---
    const formattedStats = {
      totalCandidates: stats[0]?.totalCandidates[0]?.count || 0,
      newCandidatesLast30Days: stats[0]?.newCandidatesLast30Days[0]?.count || 0,
      openJobs: openJobsCount,
      newJobsLast30Days: newJobsLast30Days,
      totalHRs: hrCount,
    };

    console.log(chalk.blue('Dashboard stats successfully aggregated and sent.'));
    res.status(200).json(formattedStats);

  } catch (error) {
    console.error(chalk.red.bold('Error in getDashboardStats:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
