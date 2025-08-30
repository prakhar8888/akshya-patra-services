import Sector from '../models/Sector.js';
import { logActivity } from '../services/activityLogService.js';
import chalk from 'chalk';

/**
 * @desc    Create a new sector
 * @route   POST /api/sectors
 * @access  Private (Admin, Super Admin)
 */
export const createSector = async (req, res) => {
  const { name } = req.body;

  // --- Enterprise-level Validation ---
  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Sector name is required.' });
  }

  try {
    const sectorExists = await Sector.findOne({ name });

    if (sectorExists) {
      return res.status(400).json({ message: 'A sector with this name already exists.' });
    }

    const sector = new Sector({
      name,
      createdBy: req.user.id, // Get the logged-in user's ID from the protect middleware
    });

    const createdSector = await sector.save();

    // --- Activity Logging for Audit Trail ---
    await logActivity(req.user.id, 'SECTOR_CREATED', {
      sectorName: createdSector.name,
    });

    console.log(chalk.green(`New sector "${createdSector.name}" created by ${req.user.name}`));
    res.status(201).json(createdSector);
  } catch (error) {
    console.error(chalk.red.bold('Error in createSector:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all sectors with pagination
 * @route   GET /api/sectors
 * @access  Private (Authenticated Users)
 */
export const getAllSectors = async (req, res) => {
  try {
    const pageSize = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const count = await Sector.countDocuments();
    const sectors = await Sector.find({})
      .populate('createdBy', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ name: 1 }); // Sort alphabetically by name

    res.status(200).json({
      sectors,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(chalk.red.bold('Error in getAllSectors:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
