import mongoose from 'mongoose';

const sectorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sector name is required.'], // Added user-friendly message
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters.'],
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

const Sector = mongoose.model('Sector', sectorSchema);

export default Sector;
