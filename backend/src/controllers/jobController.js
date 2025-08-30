import Job from '../models/Job.js';
import { logActivity } from '../services/activityLogService.js';
import chalk from 'chalk';

/**
 * @desc    Create a new job posting
 * @route   POST /api/jobs
 * @access  Private/Admin
 */
export const createJob = async (req, res) => {
  const { designation, sector, city, area, salary, description } = req.body;

  // --- Enterprise-level Validation ---
  if (!designation || !sector || !city) {
    return res.status(400).json({ message: 'Designation, sector, and city are required fields.' });
  }

  try {
    const createdBy = req.user.id;

    const job = new Job({
      designation,
      sector,
      city,
      area,
      salary,
      description,
      createdBy,
    });

    const createdJob = await job.save();
    await logActivity(createdBy, 'JOB_CREATED', { jobTitle: createdJob.designation });

    console.log(chalk.green(`New job created: "${createdJob.designation}" by ${req.user.name}`));
    res.status(201).json(createdJob);
  } catch (error) {
    console.error(chalk.red.bold('Error in createJob:'), error);
    res.status(500).json({ message: 'Server error while creating job.' });
  }
};

/**
 * @desc    Get all open jobs (for public candidate view)
 * @route   GET /api/jobs
 * @access  Public
 */
export const getAllJobs = async (req, res) => {
  try {
    // This public endpoint fetches all open jobs. For an enterprise app with thousands of
    // open jobs, pagination might be added here in the future.
    const jobs = await Job.find({ status: 'Open' }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(chalk.red.bold('Error in getAllJobs:'), error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all jobs with pagination (for Admin panel view)
 * @route   GET /api/jobs/admin/all
 * @access  Private/Admin
 */
export const getJobsForAdmin = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const count = await Job.countDocuments();
    const jobs = await Job.find()
      .populate('createdBy', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      jobs,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(chalk.red.bold('Error in getJobsForAdmin:'), error);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * @desc    Update a job posting
 * @route   PUT /api/jobs/:id
 * @access  Private/Admin
 */
export const updateJob = async (req, res) => {
  try {
    const { designation, sector, city, area, salary, description, status } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Update fields only if they are provided in the request body
    job.designation = designation || job.designation;
    job.sector = sector || job.sector;
    job.city = city || job.city;
    job.area = area || job.area;
    job.salary = salary || job.salary;
    job.description = description || job.description;
    job.status = status || job.status;

    const updatedJob = await job.save();
    await logActivity(req.user.id, 'JOB_UPDATED', { jobId: updatedJob._id, jobTitle: updatedJob.designation });

    console.log(chalk.blue(`Job "${updatedJob.designation}" updated by ${req.user.name}`));
    res.json(updatedJob);
  } catch (error) {
    console.error(chalk.red.bold('Error in updateJob:'), error);
    res.status(500).json({ message: 'Server error while updating job.' });
  }
};

/**
 * @desc    Delete a job posting
 * @route   DELETE /api/jobs/:id
 * @access  Private/Admin
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.deleteOne();

    await logActivity(req.user.id, 'JOB_DELETED', { jobId: req.params.id, jobTitle: job.designation });

    console.log(chalk.yellow(`Job "${job.designation}" deleted by ${req.user.name}`));
    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    console.error(chalk.red.bold('Error in deleteJob:'), error);
    res.status(500).json({ message: 'Server error while deleting job.' });
  }
};
