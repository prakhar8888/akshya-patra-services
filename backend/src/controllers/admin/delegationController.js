// src/controllers/admin/delegationController.js
import Delegation from '../../models/Delegation.js';

// ✅ Create a new delegation
export const createDelegation = async (req, res) => {
  try {
    const { fromUser, toUser, role } = req.body;

    if (!fromUser || !toUser || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const delegation = await Delegation.create({
      fromUser,
      toUser,
      role,
      active: true,
    });

    res.status(201).json(delegation);
  } catch (error) {
    console.error('Error creating delegation:', error.message);
    res.status(500).json({ message: 'Server error creating delegation' });
  }
};

// ✅ Get all active delegations
export const getActiveDelegations = async (req, res) => {
  try {
    const delegations = await Delegation.find({ active: true });
    res.status(200).json(delegations);
  } catch (error) {
    console.error('Error fetching delegations:', error.message);
    res.status(500).json({ message: 'Server error fetching delegations' });
  }
};

// ✅ Revoke a delegation
export const revokeDelegation = async (req, res) => {
  try {
    const { id } = req.params;

    const delegation = await Delegation.findById(id);
    if (!delegation) {
      return res.status(404).json({ message: 'Delegation not found' });
    }

    delegation.active = false;
    await delegation.save();

    res.status(200).json({ message: 'Delegation revoked successfully' });
  } catch (error) {
    console.error('Error revoking delegation:', error.message);
    res.status(500).json({ message: 'Server error revoking delegation' });
  }
};
