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

// Define the expected channel name for security
const PRESENCE_CHANNEL_NAME = 'presence-hrms-monitoring';

/**
 * @desc    Authenticate a user for a private or presence Pusher channel
 * @route   POST /api/pusher/auth
 * @access  Private (Authenticated Users)
 */
export const authenticateUser = (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;

  // --- Enterprise-level Security: Validate the channel name ---
  if (channel !== PRESENCE_CHANNEL_NAME) {
    console.error(chalk.red(`Forbidden: User ${req.user.name} attempted to auth for invalid channel: ${channel}`));
    return res.status(403).json({ message: 'Not authorized for this channel.' });
  }

  // Presence channels require user data to be sent to other clients
  const presenceData = {
    user_id: req.user.id,
    user_info: {
      name: req.user.name,
      role: req.user.role,
    },
  };

  try {
    const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
    console.log(chalk.cyan(`User ${req.user.name} authenticated for Pusher channel: ${channel}`));
    res.send(authResponse);
  } catch (error) {
    console.error(chalk.red.bold('Pusher authentication failed:'), error);
    res.status(500).json({ message: 'Pusher authentication failed', error: error.message });
  }
};
