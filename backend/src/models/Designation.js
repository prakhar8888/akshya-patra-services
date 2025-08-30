import mongoose from 'mongoose';

const designationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Designation name is required.'],
      trim: true,
    },
    // This creates a relationship between Designation and Sector
    sector: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Sector', // It must reference a valid Sector
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// --- Enterprise-level Indexing for Performance & Uniqueness ---
// This ensures a designation name is unique within its parent sector.
designationSchema.index({ name: 1, sector: 1 }, { unique: true });


const Designation = mongoose.model('Designation', designationSchema);

export default Designation;
