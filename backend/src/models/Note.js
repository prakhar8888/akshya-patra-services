import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    // Link to the candidate the note is about
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Candidate',
      index: true, // CRITICAL: Index for fast retrieval of notes per candidate
    },
    // Link to the user who wrote the note
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // The content of the note
    content: {
      type: String,
      required: [true, 'Note content cannot be empty.'],
      trim: true,
      maxlength: [1000, 'Note content cannot exceed 1000 characters.'], // Data Integrity
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;
