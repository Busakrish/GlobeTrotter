import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { mockCities } from '../data/mockCities';
import Input, { Select } from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  User,
  Mail,
  MapPin,
  Compass,
  Plane,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Heart,
  Save,
  Trash2,
} from 'lucide-react';

export function Profile() {
  const { currentUser, updateProfile, currency, setCurrency } = useAuth();
  const { notifySuccess } = useNotification();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Priya Sharma',
    email: currentUser?.email || 'priya.sharma@globetrotter.io',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    travelStyle: currentUser?.travelStyle || 'Balanced Explorer',
    homeAirport: currentUser?.homeAirport || 'BOM (Mumbai, India)',
    dietary: 'Vegetarian Friendly',
  });

  const [wishlist, setWishlist] = useState(currentUser?.savedDestinations || ['city-goa', 'city-jaipur', 'city-tokyo']);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      savedDestinations: wishlist,
    });
    notifySuccess('Travel profile and preferences saved successfully!');
  };

  const removeWishlist = (cityId) => {
    setWishlist((prev) => prev.filter((id) => id !== cityId));
    notifySuccess('Removed destination from saved wishlist.');
  };

  const wishlistCities = mockCities.filter((c) => wishlist.includes(c.id));

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
          <User className="w-3.5 h-3.5" />
          Account & Traveler Settings
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Personal Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your default travel style, home airport departures, and saved dream destinations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            Traveler Information
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
            />
            <div className="flex-1 w-full space-y-2">
              <Input
                label="Avatar Image URL"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Travel Preferences Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Plane className="w-4 h-4 text-indigo-600" />
            Travel Preferences & Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Default Travel Style"
              value={formData.travelStyle}
              onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
              options={[
                { value: 'Balanced Explorer', label: 'Balanced Explorer (Value & Comfort)' },
                { value: 'Backpacker', label: 'Backpacker (Budget & Hostels)' },
                { value: 'Luxury Heritage', label: 'Luxury Heritage (Resorts & Spas)' },
                { value: 'Solo Adventurer', label: 'Solo Adventurer (Fast & Dynamic)' },
                { value: 'Family Traveler', label: 'Family Traveler (Guided Pace)' },
              ]}
            />

            <Input
              label="Home Airport / Base City"
              placeholder="e.g. BOM (Mumbai) or DEL (New Delhi)"
              value={formData.homeAirport}
              onChange={(e) => setFormData({ ...formData, homeAirport: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Currency
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

            <Input
              label="Dietary / Dining Preferences"
              placeholder="e.g. Vegetarian, Seafood, Halal, Vegan"
              value={formData.dietary}
              onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
            />
          </div>
        </div>

        {/* Wishlist Saved Destinations */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              Saved Dream Destinations ({wishlistCities.length})
            </h3>
          </div>

          {wishlistCities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {wishlistCities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 gap-2"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-9 h-9 rounded-xl object-cover shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{city.name}</h4>
                      <p className="text-[10px] text-slate-500">{city.country}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeWishlist(city.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-2">
              No saved destinations in your wishlist yet.
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" icon={Save}>
            Save Profile & Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
