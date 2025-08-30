import Note from '../models/Note.js';
import Candidate from '../models/Candidate.js';
import { logActivity } from '../services/activityLogService.js';
import chalk from 'chalk';

/**
 * @desc    Create a new note for a candidate
 * @route   POST /api/notes
 * @access  Private (hr-manager and above)
 */
export const createNote = async (req, res) => {
  const { candidateId, content } = req.body;

  // --- Enterprise-level Validation ---
  if (!candidateId || !content) {
    return res.status(400).json({ message: 'Candidate ID and note content are required.' });
  }

  try {
    // Check if the candidate exists to ensure data integrity
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const note = new Note({
      candidate: candidateId,
      author: req.user.id, // Get the logged-in user's ID
      content,
    });

    const createdNote = await note.save();

    // --- Structured Activity Logging for Audit Trail ---
    await logActivity(req.user.id, 'NOTE_ADDED', {
        candidateName: candidate.name,
        noteId: createdNote._id,
    });

    console.log(chalk.green(`New note added for candidate "${candidate.name}" by ${req.user.name}`));
    res.status(201).json(createdNote);
  } catch (error) {
    console.error(chalk.red.bold('Error in createNote:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all notes for a specific candidate
 * @route   GET /api/notes/:candidateId
 * @access  Private (hr-manager and above)
 */
export const getNotesForCandidate = async (req, res) => {
  try {
    const notes = await Note.find({ candidate: req.params.candidateId })
      .populate('author', 'name') // Show the name of the note's author
      .sort({ createdAt: -1 }); // Show the most recent notes first

    res.status(200).json(notes);
  } catch (error) {
    console.error(chalk.red.bold('Error in getNotesForCandidate:'), error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
