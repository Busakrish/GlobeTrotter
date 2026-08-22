import { createContext, useContext, useState, useEffect } from 'react';
import { initialNotifications } from '../data/mockNotifications';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('globetrotter_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  useEffect(() => {
    localStorage.setItem('globetrotter_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const showToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const notifySuccess = (msg) => showToast(msg, 'success');
  const notifyError = (msg) => showToast(msg, 'error', 4500);
  const notifyWarning = (msg) => showToast(msg, 'warning');
  const notifyInfo = (msg) => showToast(msg, 'info');

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    notifySuccess('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        notifications,
        unreadCount,
        showToast,
        removeToast,
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export default NotificationContext;
