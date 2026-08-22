import DataStore from '../config/dataStore.js';

export const getTripCollaborators = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = DataStore.findById('trips', tripId) || DataStore.findOne('trips', { id: tripId });

    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const collaborators = trip.collaborators || [
      {
        id: 'collab-1',
        name: 'Rohan Mehta',
        email: 'rohan.mehta@traveler.io',
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        joinedAt: new Date().toISOString(),
      },
      {
        id: 'collab-2',
        name: 'Ananya Roy',
        email: 'ananya.roy@traveler.io',
        role: 'viewer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        joinedAt: new Date().toISOString(),
      },
    ];

    return res.json({
      success: true,
      count: collaborators.length,
      collaborators,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addCollaborator = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { email, name, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide collaborator email' });
    }

    const trip = DataStore.findById('trips', tripId) || DataStore.findOne('trips', { id: tripId });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const newCollab = {
      id: 'collab-' + Date.now(),
      name: name || email.split('@')[0].replace('.', ' '),
      email,
      role: role || 'editor',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      joinedAt: new Date().toISOString(),
    };

    const currentCollaborators = trip.collaborators || [];
    currentCollaborators.push(newCollab);

    DataStore.findByIdAndUpdate('trips', trip.id, { collaborators: currentCollaborators });

    return res.status(201).json({
      success: true,
      message: `Invited ${newCollab.name} as a ${newCollab.role}`,
      collaborator: newCollab,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeCollaborator = async (req, res) => {
  try {
    const { tripId, userId } = req.params;
    const trip = DataStore.findById('trips', tripId) || DataStore.findOne('trips', { id: tripId });

    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    let currentCollaborators = trip.collaborators || [];
    currentCollaborators = currentCollaborators.filter(
      (c) => c.id !== userId && c.userId !== userId && c.email !== userId
    );

    DataStore.findByIdAndUpdate('trips', trip.id, { collaborators: currentCollaborators });

    return res.json({
      success: true,
      message: 'Collaborator removed from trip',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { getTripCollaborators, addCollaborator, removeCollaborator };
