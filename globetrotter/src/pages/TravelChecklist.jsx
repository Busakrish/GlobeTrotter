import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import TripHeader from '../components/trip/TripHeader';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  CalendarCheck,
  FileText,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export function TravelChecklist() {
  const { tripId } = useParams();
  const {
    trips,
    getTripById,
    getTripChecklist,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
  } = useTrips();
  const { notifySuccess, notifyWarning } = useNotification();

  const trip = getTripById(tripId) || trips[0];
  const categories = getTripChecklist(trip?.id);

  // Add Item Modal
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('cat-before');
  const [newItemText, setNewItemText] = useState('');

  if (!trip) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Trip not found.</p>
        <Link to="/trips" className="text-xs font-bold text-indigo-600 mt-2 inline-block">
          Return to Trips
        </Link>
      </div>
    );
  }

  // Calculate overall completion
  const allItems = categories.flatMap((c) => c.items);
  const completedCount = allItems.filter((i) => i.completed).length;
  const totalCount = allItems.length;
  const completionPercentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggle = (catId, itemId, text, completed) => {
    toggleChecklistItem(trip.id, catId, itemId);
    if (!completed) {
      notifySuccess(`Checked off: "${text}"`);
    }
  };

  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    addChecklistItem(trip.id, selectedCategoryId, newItemText.trim());
    notifySuccess(`Added "${newItemText}" to checklist!`);
    setNewItemText('');
    setAddItemModalOpen(false);
  };

  const categoryIcons = {
    'cat-before': CalendarCheck,
    'cat-docs': FileText,
    'cat-prep': Zap,
  };

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* 1. Trip Header */}
      <TripHeader trip={trip} activeTab="checklist" />

      {/* 2. Progress Overview Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              Pre-Departure Readiness
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Travel Readiness Checklist
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Track essential bookings, passport validity, visas, and health preparations for {trip.title}.
            </p>
          </div>

          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={() => setAddItemModalOpen(true)}
          >
            Add Checklist Item
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="pt-2">
          <ProgressBar
            value={completedCount}
            max={totalCount}
            label={`${completedCount} of ${totalCount} items completed`}
            color={completionPercentage === 100 ? 'emerald' : 'indigo'}
            size="lg"
          />
        </div>

        {completionPercentage === 100 && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>🎉 Fantastic! You are 100% prepared for your departure!</span>
          </div>
        )}
      </div>

      {/* 3. Category Checklist Groups */}
      <div className="space-y-6">
        {categories.map((category) => {
          const Icon = categoryIcons[category.id] || CheckSquare;
          const catCompleted = category.items.filter((i) => i.completed).length;

          return (
            <div
              key={category.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{category.name}</h3>
                    <p className="text-xs text-slate-500">{category.description}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                  {catCompleted} / {category.items.length} done
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                {category.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      item.completed
                        ? 'bg-slate-50/60 border-slate-200 opacity-80'
                        : 'bg-white border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 select-none">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() =>
                          handleToggle(category.id, item.id, item.text, item.completed)
                        }
                        className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer shrink-0"
                      />
                      <span
                        className={`text-xs font-semibold truncate ${
                          item.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {item.text}
                      </span>
                    </label>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {item.essential && !item.completed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                          Critical
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          deleteChecklistItem(trip.id, category.id, item.id);
                          notifyWarning(`Removed item: "${item.text}"`);
                        }}
                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                        title="Delete checklist item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Add into this category */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  setAddItemModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add item to {category.name}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Checklist Item */}
      {addItemModalOpen && (
        <Modal
          isOpen={addItemModalOpen}
          onClose={() => setAddItemModalOpen(false)}
          title="Add Checklist Item"
          subtitle="Add custom reminders, document tasks or gear verifications"
        >
          <form onSubmit={handleAddItemSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Checklist Category
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Item Description"
              placeholder="e.g. Renew international roaming, print hotel voucher"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              required
              autoFocus
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setAddItemModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Plus}>
                Add Item
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default TravelChecklist;
