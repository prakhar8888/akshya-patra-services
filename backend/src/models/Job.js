import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Designation is required.'],
      ref: 'Designation', // CRITICAL: Links to the Designation model
    },
    sector: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Sector is required.'],
      ref: 'Sector', // CRITICAL: Links to the Sector model
    },
    city: {
      type: String,
      required: [true, 'City is required.'],
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    salary: {
      type: String,
      required: [true, 'Salary information is required.'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A job description is required.'],
      trim: true,
      maxlength: [2000, 'Job description cannot be more than 2000 characters.'],
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'On Hold'],
      default: 'Open',
      index: true, // CRITICAL: Index for fast filtering of open jobs
    },
    // Link to the user who created the job posting
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
