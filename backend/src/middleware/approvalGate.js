// backend/src/middleware/approvalGate.js
import AdminConfig from '../models/AdminConfig.js'; // placeholder for future settings model
import ApprovalTicket from '../models/ApprovalTicket.js';

/**
 * A middleware that gates sensitive actions based on admin-configurable settings.
 * If a setting (like "Privileged Access Management") is enabled, it intercepts
 * the request and creates an ApprovalTicket instead of proceeding.
 *
 * @param {string} actionType - The type of action being gated (e.g., 'DailyReport').
 * @param {Function} getResourceDetails - A function to extract necessary details from the request to build the ticket.
 */
const approvalGate = (actionType, getResourceDetails) => {
  return async (req, res, next) => {
    try {
      // In a real implementation, this would come from a cached config service
      // For now, we assume a placeholder for the setting.
      const pamIsEnabled = false; // Placeholder: Will be connected to SuperAdmin settings later

      if (!pamIsEnabled) {
        // If PAM is off, proceed with the original controller logic
        return next();
      }

      // If PAM is ON, create an approval ticket
      const { resourceId, details, purpose, approverId } = getResourceDetails(req);

      if (!resourceId || !details || !purpose || !approverId) {
        return res.status(400).json({ message: 'Missing required details for approval ticket.' });
      }

      const ticket = new ApprovalTicket({
        requester: req.user._id,
        approver: approverId, // The designated approver
        resourceType: actionType,
        resourceId,
        details,
        purpose,
        status: 'pending',
      });

      await ticket.save();

      return res.status(202).json({
        message: 'Action requires approval. An approval ticket has been created.',
        ticketId: ticket._id,
      });

    } catch (error) {
      console.error('Error in approvalGate middleware:', error);
      res.status(500).json({ message: 'Internal server error during approval check.' });
    }
  };
};

export default approvalGate;
