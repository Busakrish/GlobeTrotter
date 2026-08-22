import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, User } from 'lucide-react';

export function PhotoLightboxModal({ isOpen, onClose, photos = [], activeIndex = 0, onNavigate, memory }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && activeIndex > 0) onNavigate(activeIndex - 1);
      if (e.key === 'ArrowRight' && activeIndex < photos.length - 1) onNavigate(activeIndex + 1);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, photos.length, onClose, onNavigate]);

  if (!isOpen || !photos || photos.length === 0) return null;

  const currentPhoto = photos[activeIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-4 sm:p-6">
      {/* Top action bar */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20 text-white">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
            {activeIndex + 1} / {photos.length}
          </span>
          {memory?.location && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {memory.location}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="relative max-w-5xl max-h-[80vh] flex items-center justify-center">
        <img
          src={currentPhoto}
          alt={`Memory photo ${activeIndex + 1}`}
          className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition-all"
        />

        {/* Previous Button */}
        {photos.length > 1 && activeIndex > 0 && (
          <button
            type="button"
            onClick={() => onNavigate(activeIndex - 1)}
            className="absolute left-2 sm:-left-12 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {photos.length > 1 && activeIndex < photos.length - 1 && (
          <button
            type="button"
            onClick={() => onNavigate(activeIndex + 1)}
            className="absolute right-2 sm:-right-12 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Info Bar */}
      {memory && (
        <div className="absolute bottom-4 inset-x-4 sm:max-w-2xl sm:mx-auto bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 text-white border border-white/10 z-20">
          <div className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <img
                src={memory.author?.avatar}
                alt={memory.author?.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-bold text-slate-200">{memory.author?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{memory.date} • {memory.time}</span>
            </div>
          </div>
          {memory.caption && <p className="text-xs text-slate-300 line-clamp-2 mt-1">{memory.caption}</p>}
        </div>
      )}
    </div>
  );
}

export default PhotoLightboxModal;
