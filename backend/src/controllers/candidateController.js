import Candidate from '../models/Candidate.js';
import { logActivity } from '../services/activityLogService.js';
import { parseResume } from '../services/resumeParserService.js';
import chalk from 'chalk';

// @desc    Create a new candidate from the public website
// @route   POST /api/candidates/apply
// @access  Public
export const createCandidate = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Resume file is required.' });
  }

  try {
    console.log(chalk.blue(`Parsing resume: ${req.file.originalname}`));
    const parsedData = await parseResume(req.file.path);
    console.log(chalk.green('Resume parsed successfully.'));

    const candidate = new Candidate({
      name: parsedData.name,
      email: parsedData.email,
      phone: parsedData.phone,
      totalExperience: parsedData.totalExperience,
      parserConfidence: parsedData.parserConfidence, // Save the detailed confidence object
      resumePath: req.file.path,
      appliedForJob: req.body.jobId,
      source: 'Website',
      // If confidence is low, set status to Pending Review, otherwise Pending
      status: parsedData.parserConfidence.overall < 0.75 ? 'Pending Review' : 'Pending',
    });

    const createdCandidate = await candidate.save();

    await logActivity(null, 'CANDIDATE_APPLY', {
      candidateName: createdCandidate.name,
      jobId: req.body.jobId
    });

    res.status(201).json(createdCandidate);
  } catch (error) {
    console.error(chalk.red('Error creating candidate:'), error);
    res.status(500).json({ message: error.message || 'Server error during candidate creation.' });
  }
};

// @desc    Create a new candidate from the HR panel
// @route   POST /api/candidates/hr-upload
// @access  Private/Recruiter
export const createCandidateFromHR = async (req, res) => {
  try {
    const { name, email, phone, source } = req.body;
    const createdBy = req.user.id;

    if (!name || !email || !phone || !source) {
        return res.status(400).json({ message: 'Name, email, phone, and source are required.' });
    }

    const candidate = new Candidate({
      name,
      email,
      phone,
      resumePath: req.file ? req.file.path : null,
      source,
      status: 'Reviewed', // Candidates added by HR are considered pre-screened
      createdBy,
    });

    const createdCandidate = await candidate.save();

    await logActivity(createdBy, 'CANDIDATE_UPLOAD', { candidateName: createdCandidate.name });

    res.status(201).json(createdCandidate);
  } catch (error) {
    console.error(chalk.red('Error creating candidate from HR:'), error);
    res.status(500).json({ message: 'Server error during candidate creation.' });
  }
};


// @desc    Get all candidates with pagination, search, and filtering
// @route   GET /api/candidates
// @access  Private/Recruiter
export const getAllCandidates = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const { searchTerm, status } = req.query;

    // Build the query dynamically
    const query = {};

    if (status) {
      query.status = status;
    }

    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex }
      ];
    }

    const count = await Candidate.countDocuments(query);
    const candidates = await Candidate.find(query)
      .populate('appliedForJob', 'designation')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      candidates,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(chalk.red('Error fetching candidates:'), error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get candidates for the manual review queue
// @route   GET /api/candidates/review-queue
// @access  Private/Recruiter
export const getReviewQueueCandidates = async (req, res) => {
    try {
        const pageSize = 10;
        const page = parseInt(req.query.page, 10) || 1;

        const query = { status: 'Pending Review' };

        const count = await Candidate.countDocuments(query);
        const candidates = await Candidate.find(query)
            .populate('appliedForJob', 'designation')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ 'parserConfidence.overall': 1 }); // Show lowest confidence first

        res.json({
            candidates,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        console.error(chalk.red('Error fetching review queue candidates:'), error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get a single candidate by ID
// @route   GET /api/candidates/:id
// @access  Private/Recruiter
export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id)
      .populate('appliedForJob', 'designation sector city')
      .populate('createdBy', 'name');

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error) {
    console.error(chalk.red('Error fetching candidate by ID:'), error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update candidate status
// @route   PUT /api/candidates/:id/status
// @access  Private/Recruiter
export const updateCandidateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required.' });
        }

        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        await logActivity(req.user.id, 'STATUS_UPDATE', {
            candidateName: candidate.name,
            newStatus: status,
        });

        res.json(candidate);
    } catch (error) {
        console.error(chalk.red('Error updating candidate status:'), error);
        res.status(500).json({ message: 'Server error' });
    }
};

