import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Input, { Select } from '../components/common/Input';
import Button from '../components/common/Button';
import ConfirmationModal from '../components/common/ConfirmationModal';
import {
  Sliders,
  User,
  Lock,
  DollarSign,
  Globe,
  Bell,
  Sun,
  Moon,
  LogOut,
  Trash2,
  Save,
  ShieldCheck,
  Check,
} from 'lucide-react';

export function Settings() {
  const { currentUser, currency, setCurrency, logout } = useAuth();
  const { notifySuccess, notifyWarning } = useNotification();
  const navigate = useNavigate();

  // Settings State
  const [language, setLanguage] = useState('English (US)');
  const [travelStyle, setTravelStyle] = useState(currentUser?.travelStyle || 'Balanced Explorer');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('globetrotter_theme') || 'light';
  });

  // Apply theme to DOM when it changes
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('globetrotter_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    notifySuccess(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} mode!`);
  };

  // Notification Toggles
  const [notifToggles, setNotifToggles] = useState({
    tripReminders: true,
    recommendations: true,
    budgetAlerts: true,
    activityReminders: false,
  });

  // Change Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Modal State
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

  const toggleNotif = (key) => {
    setNotifToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    notifySuccess('Notification preferences updated.');
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    notifySuccess('Travel & interface preferences saved!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notifyWarning('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      notifyWarning('Password must be at least 6 characters long.');
      return;
    }

    notifySuccess('Security password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccountConfirm = () => {
    setDeleteAccountModalOpen(false);
    logout();
    notifySuccess('Account deleted. Redirecting to login.');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
          <Sliders className="w-3.5 h-3.5" />
          System & Account Settings
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure multi-currency preferences, notification delivery channels, themes, and account security.
        </p>
      </div>

      {/* 1. Global Preferences (Currency, Language, Style) */}
      <form onSubmit={handleSavePreferences} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-600" />
          Travel & Regional Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Display Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="INR">₹ INR (Indian Rupee)</option>
              <option value="USD">$ USD (US Dollar)</option>
              <option value="EUR">€ EUR (Euro)</option>
            </select>
          </div>

          <Select
            label="Preferred Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={[
              { value: 'English (US)', label: 'English (US)' },
              { value: 'English (UK)', label: 'English (UK)' },
              { value: 'Hindi', label: 'Hindi (हिन्दी)' },
              { value: 'French', label: 'French (Français)' },
              { value: 'Japanese', label: 'Japanese (日本語)' },
            ]}
          />

          <Select
            label="Default Travel Style"
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
            options={[
              { value: 'Balanced Explorer', label: 'Balanced Explorer' },
              { value: 'Backpacker', label: 'Backpacker' },
              { value: 'Luxury Heritage', label: 'Luxury Heritage' },
              { value: 'Solo Adventurer', label: 'Solo Adventurer' },
            ]}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="sm" icon={Save}>
            Save Preferences
          </Button>
        </div>
      </form>

      {/* 2. Notification Preferences Toggles */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          Notification Channels & Alerts
        </h3>

        <div className="space-y-3">
          {[
            {
              key: 'tripReminders',
              title: 'Upcoming Trip Countdown Reminders',
              desc: 'Get notified 7 days, 3 days, and 24 hours before your trip departure.',
            },
            {
              key: 'budgetAlerts',
              title: 'Smart Budget & Deficit Warnings',
              desc: 'Real-time notifications when category spending reaches 85% or exceeds target budget.',
            },
            {
              key: 'recommendations',
              title: 'AI Travel Matcher Suggestions',
              desc: 'Personalized destination recommendations tailored to your past journeys.',
            },
            {
              key: 'activityReminders',
              title: 'Live Activity Schedule Push Alerts',
              desc: 'Timely reminders 1 hour before scheduled tours and restaurant bookings.',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleNotif(item.key)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  notifToggles[item.key] ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    notifToggles[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Appearance & Theme */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Sun className="w-4 h-4 text-indigo-600" />
          Theme & Visual Appearance
        </h3>

        <div className="grid grid-cols-2 gap-4 max-w-sm">
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'bg-indigo-50 border-indigo-600 text-indigo-900 ring-2 ring-indigo-600/20'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <div className="text-left">
              <p className="text-xs font-bold">Light Mode</p>
              <span className="text-[10px] text-slate-500">Bright clean style</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'bg-slate-900 border-indigo-500 text-white ring-2 ring-indigo-500/20'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <div className="text-left">
              <p className="text-xs font-bold">Dark Mode</p>
              <span className="text-[10px] text-slate-500">OLED dark style</span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Security: Change Password */}
      <form onSubmit={handlePasswordSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-indigo-600" />
          Security & Password
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, currentPassword: e.target.value })
            }
            required
          />
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, confirmPassword: e.target.value })
            }
            required
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="sm" icon={Save}>
            Update Password
          </Button>
        </div>
      </form>

      {/* 5. Danger Zone: Logout & Delete Account */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/50 border border-rose-100 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-rose-900 border-b border-rose-100 pb-3">
          Account Actions
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900">Sign Out of GlobeTrotter</h4>
            <p className="text-[11px] text-slate-500">Sign out of this active session on this browser.</p>
          </div>

          <Button
            size="sm"
            variant="outline"
            icon={LogOut}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign Out
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-rose-100">
          <div>
            <h4 className="text-xs font-bold text-rose-700">Delete Account & Stored Data</h4>
            <p className="text-[11px] text-slate-500">Permanently erase all stored itineraries, saved places, and profile details.</p>
          </div>

          <Button
            size="sm"
            variant="danger"
            icon={Trash2}
            onClick={() => setDeleteAccountModalOpen(true)}
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteAccountModalOpen}
        onClose={() => setDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccountConfirm}
        title="Delete Account & All Data?"
        message="This will permanently delete all your multi-city itineraries, custom expenses, and saved dream destinations from this browser. This action cannot be reversed."
        confirmText="Yes, Permanently Delete"
        variant="danger"
      />
    </div>
  );
}

export default Settings;
