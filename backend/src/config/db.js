import mongoose from 'mongoose';
import chalk from 'chalk';

// Mongoose connection options for a robust, production-ready setup
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB database using the URI and options
    const conn = await mongoose.connect(process.env.MONGO_URI, mongooseOptions);

    console.log(chalk.cyan.bold(`🔌 MongoDB Connected: ${conn.connection.host}`));
  } catch (error) {
    console.error(chalk.red.bold(`❌ Error connecting to MongoDB: ${error.message}`));
    // Exit the process with failure
    process.exit(1);
  }
};

// Gracefully handle shutdown signals
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log(chalk.yellow('MongoDB connection closed due to app termination.'));
  process.exit(0);
});

export default connectDB;
