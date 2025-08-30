import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Candidate name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Candidate email is required.'],
      unique: true, // CRITICAL: Prevents duplicate candidate entries
      lowercase: true,
      trim: true,
      match: [/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, 'Please enter a valid email address'],
      index: true, // Index for fast lookups by email
    },
    phone: {
      type: String,
      required: [true, 'Candidate phone number is required.'],
    },
    city: {
      type: String,
    },
    totalExperience: { // Renamed for consistency with the resume parser
      type: Number,
      required: true,
      default: 0,
    },
    resumePath: { // Renamed for consistency with controllers
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      enum: ['Website', 'WhatsApp', 'LinkedIn', 'Email', 'Naukri.com'],
    },
    appliedForJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    createdBy: { // Renamed for consistency with other models
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Interviewing', 'Hired', 'Rejected', 'Pending Review'],
      default: 'Pending',
      index: true, // Index for fast filtering by status
    },
    // --- FIELDS FOR PARSER CONFIDENCE ---
    parserConfidence: {
      overall: { type: Number, default: 0 },
      fields: {
        name: { type: Number, default: 0 },
        email: { type: Number, default: 0 },
        phone: { type: Number, default: 0 },
        experience: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;
