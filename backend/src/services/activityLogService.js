import ActivityLog from '../models/ActivityLog.js';
import Pusher from 'pusher';
import chalk from 'chalk';

// Initialize Pusher with credentials from our .env file
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

/**
 * A reusable service to log user activities with structured data and broadcast them in real-time.
 * @param {string | null} userId - The ID of the user performing the action (or null for system actions).
 * @param {string} action - A structured action type (e.g., 'USER_LOGIN', 'JOB_CREATED').
 * @param {object} details - A rich object containing details of the action.
 */
export const logActivity = async (userId, action, details = {}) => {
  try {
    const log = new ActivityLog({
      user: userId,
      action,
      details, // Store the rich details object
    });
    await log.save();

    // --- BROADCAST REAL-TIME EVENT ---
    // We only broadcast if there's a user associated with the action
    if (userId) {
      // Trigger an event on our presence channel with the structured data
      pusher.trigger('presence-hrms-monitoring', 'user-activity', {
        userId: userId,
        action: action,
        details: details, // Broadcast the full details object
        timestamp: new Date(),
      });
    }
    // --- END BROADCAST ---

  } catch (error) {
    console.error(chalk.red.bold('Failed to log activity:'), error);
  }
};
