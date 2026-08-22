import DataStore from '../config/dataStore.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id).toString() : null;
    let notifs = DataStore.getCollection('notifications');

    if (userId) {
      const userNotifs = notifs.filter((n) => !n.userId || n.userId === userId);
      if (userNotifs.length) notifs = userNotifs;
    }

    const unreadCount = notifs.filter((n) => !n.read).length;

    return res.json({
      success: true,
      count: notifs.length,
      unreadCount,
      notifications: notifs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    DataStore.findByIdAndUpdate('notifications', id, { read: true });

    return res.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const clearNotifications = async (req, res) => {
  try {
    const userId = req.user ? (req.user._id || req.user.id).toString() : null;
    if (userId) {
      DataStore.deleteMany('notifications', { userId });
    } else {
      DataStore.setCollection('notifications', []);
    }

    return res.json({
      success: true,
      message: 'Notifications cleared',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { getNotifications, markNotificationRead, clearNotifications };
