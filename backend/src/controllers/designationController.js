import Designation from '../models/Designation.js';
import Sector from '../models/Sector.js';
import { logActivity } from '../services/activityLogService.js';
import chalk from 'chalk';

/**
 * @desc    Create a new designation
 * @route   POST /api/designations
 * @access  Private (Admin, Super Admin)
 */
export const createDesignation = async (req, res) => {
  const { name, sectorId } = req.body;

  // --- Enterprise-level Validation ---
  if (!name || !sectorId) {
    return res.status(400).json({ message: 'Designation name and sector are required.' });
  }

  try {
    // Check if the parent sector exists
    const sector = await Sector.findById(sectorId);
    if (!sector) {
      return res.status(404).json({ message: 'Sector not found' });
    }

    // --- Prevent Duplicate Designations within the same sector ---
    const designationExists = await Designation.findOne({ name, sector: sectorId });
    if (designationExists) {
      return res.status(400).json({ message: `Designation "${name}" already exists in the "${sector.name}" sector.` });
    }

    const designation = new Designation({
      name,
      sector: sectorId,
      createdBy: req.user.id,
    });

    const createdDesignation = await designation.save();

    // --- Activity Logging for Audit Trail ---
    await logActivity(req.user.id, 'DESIGNATION_CREATED', {
      designationName: createdDesignation.name,
      sectorName: sector.name,
    });

    console.log(chalk.green(`New designation "${createdDesignation.name}" created in sector "${sector.name}" by ${req.user.name}`));
    res.status(201).json(createdDesignation);
  } catch (error) {
    console.error(chalk.red.bold('Error in createDesignation:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all designations, optionally filtered by sector
 * @route   GET /api/designations
 * @access  Private (Authenticated Users)
 */
export const getAllDesignations = async (req, res) => {
  try {
    const filter = req.query.sectorId ? { sector: req.query.sectorId } : {};
    const designations = await Designation.find(filter).populate('sector', 'name');
    res.status(200).json(designations);
  } catch (error) {
    console.error(chalk.red.bold('Error in getAllDesignations:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
