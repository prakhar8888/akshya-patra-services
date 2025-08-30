import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'User email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      // Password is only required if the user is not signing up via Google
      required: function() { return !this.googleId; },
    },
    role: {
      type: String,
      required: true,
      enum: ['recruiter', 'hr-manager', 'admin', 'super-admin'],
      default: 'recruiter',
      index: true, // Index for faster queries by role
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents to have a null value for this field
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'inactive', 'rejected'],
      default: 'pending', // Security Best Practice: New users should require approval
    },
  },
  {
    timestamps: true,
  }
);

// --- Mongoose Middleware: Password Hashing ---
// This function automatically hashes the password before saving a user document,
// but only if the password has been modified.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// --- Mongoose Instance Method: Password Comparison ---
// This method encapsulates the password comparison logic within the model itself.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
