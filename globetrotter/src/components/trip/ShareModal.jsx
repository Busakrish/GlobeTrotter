import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import {
  Share2,
  Copy,
  Check,
  Globe,
  Mail,
  MessageCircle,
  ExternalLink,
  QrCode,
} from 'lucide-react';

export function ShareModal({ isOpen, onClose, trip }) {
  const { notifySuccess } = useNotification();
  const [copied, setCopied] = useState(false);

  if (!trip) return null;

  const shareUrl = `${window.location.origin}/trip/${trip.shareId || trip.id}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      notifySuccess('Public itinerary link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      notifySuccess('Link ready to share: ' + shareUrl);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `GlobeTrotter Itinerary: ${trip.title}`,
          text: `Check out this multi-city travel itinerary: ${trip.title}`,
          url: shareUrl,
        });
      } catch (err) {
        // user cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Explore my travel itinerary on GlobeTrotter: ${trip.title}\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareEmail = () => {
    const subject = encodeURIComponent(`Travel Itinerary: ${trip.title}`);
    const body = encodeURIComponent(`Hey! Here is our complete travel plan on GlobeTrotter:\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Travel Itinerary"
      subtitle={`Anyone with this public link can view and copy "${trip.title}"`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 text-left">
        {/* Link box */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Public Itinerary Link
          </label>
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs font-medium text-slate-700 bg-transparent border-none focus:outline-none select-all truncate"
            />
            <Button
              size="sm"
              variant={copied ? 'secondary' : 'primary'}
              icon={copied ? Check : Copy}
              onClick={handleCopyLink}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-[6px] bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              title="Open public itinerary preview in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview</span>
            </a>
          </div>
        </div>

        {/* Share buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
            Quick Share Options
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={shareWhatsApp}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 text-emerald-800 text-xs font-bold transition-all"
            >
              <MessageCircle className="w-5 h-5 mb-1 text-emerald-600" />
              WhatsApp
            </button>

            <button
              type="button"
              onClick={shareEmail}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border border-sky-100 text-sky-800 text-xs font-bold transition-all"
            >
              <Mail className="w-5 h-5 mb-1 text-sky-600" />
              Email
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-100 text-indigo-800 text-xs font-bold transition-all"
            >
              <Share2 className="w-5 h-5 mb-1 text-indigo-600" />
              Device Share
            </button>
          </div>
        </div>

        {/* Info box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-900 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            Read-Only Public Access
          </p>
          <p>
            Viewers can explore your day-by-day stops and activities without changing your original plan. They can also fork a copy to their account.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ShareModal;
