import { useState } from 'react';
import { X, Camera, MapPin, Calendar, Clock, Image as ImageIcon, Plus, Trash2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
];

export function AddMemoryModal({ isOpen, onClose, group, onAddMemory }) {
  const { currentUser } = useAuth();

  const [photos, setPhotos] = useState([SAMPLE_PHOTO_PRESETS[0]]);
  const [photoInput, setPhotoInput] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState(group?.destination || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddPhotoUrl = (e) => {
    e?.preventDefault();
    if (!photoInput.trim()) return;
    setPhotos((prev) => [...prev, photoInput.trim()]);
    setPhotoInput('');
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTogglePresetPhoto = (url) => {
    if (photos.includes(url)) {
      setPhotos((prev) => prev.filter((p) => p !== url));
    } else {
      setPhotos((prev) => [...prev, url]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length === 0) return;

    setSubmitting(true);
    try {
      await onAddMemory({
        photos,
        caption: caption.trim(),
        location: location.trim() || group?.destination,
        date,
        time,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto scrollbar-thin space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#714B67] uppercase tracking-wider mb-1">
              <Camera className="w-3.5 h-3.5" />
              Shared Memory Post
            </div>
            <h3 className="text-lg font-extrabold text-[#1B1B26] font-display">
              Add Memory to {group?.name || 'Group Journal'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Gallery Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Memory Photos ({photos.length} selected) <span className="text-rose-500">*</span>
            </label>

            {/* Selected Photos Grid Preview */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2.5">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden h-20 border border-slate-200 shadow-2xs">
                    <img src={p} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center opacity-90 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Photo Presets Grid */}
            <div className="mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Quick Preset Photos:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                {SAMPLE_PHOTO_PRESETS.map((presetUrl, idx) => {
                  const isSelected = photos.includes(presetUrl);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleTogglePresetPhoto(presetUrl)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isSelected ? 'border-[#714B67] ring-2 ring-[#714B67]/30' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={presetUrl} alt="Preset" className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#714B67]/40 flex items-center justify-center text-white font-bold text-xs">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Photo URL input */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Paste photo image URL..."
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
              />
              <Button size="xs" variant="secondary" onClick={handleAddPhotoUrl} icon={Plus}>
                Add Photo
              </Button>
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Caption & Story Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="What happened? Tell the story behind these photos..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Location Spot
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Vagator Sunset Point, Goa"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Memory Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button size="sm" variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              icon={Sparkles}
              type="submit"
              disabled={submitting || photos.length === 0}
            >
              {submitting ? 'Posting Memory...' : 'Post Memory'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMemoryModal;
