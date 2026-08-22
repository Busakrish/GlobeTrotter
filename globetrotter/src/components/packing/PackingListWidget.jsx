import { useState } from 'react';
import { useTrips } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import { CheckSquare, Square, Plus, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

export function PackingListWidget({ tripId, initialList = [] }) {
  const { trips, togglePackingItem, addPackingItem, removePackingItem } = useTrips();
  const { notifySuccess } = useNotification();
  const [newItemText, setNewItemText] = useState('');
  const [newCategory, setNewCategory] = useState('Essentials');

  const currentTrip = trips.find((t) => t.id === tripId) || trips[0];
  const list = currentTrip?.packingList || initialList;

  const totalCount = list.length;
  const checkedCount = list.filter((i) => i.checked).length;
  const percentPacked = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    addPackingItem(currentTrip.id, {
      item: newItemText.trim(),
      category: newCategory,
    });
    setNewItemText('');
    notifySuccess(`Added "${newItemText.trim()}" to packing checklist`);
  };

  // Group items by category
  const categories = ['Documents', 'Clothing', 'Electronics', 'Toiletries', 'Footwear', 'Essentials'];
  const grouped = {};
  list.forEach((item) => {
    const cat = item.category || 'Essentials';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  return (
    <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs text-left">
      {/* Header & Progress */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Smart Packing Checklist</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tailored to {currentTrip?.title || 'your trip'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            {checkedCount}/{totalCount} Packed ({percentPacked}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-6">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            percentPacked === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
          }`}
          style={{ width: `${percentPacked}%` }}
        />
      </div>

      {/* Add New Item Form */}
      <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add packing item (e.g. Travel Adapter, Sunscreen)..."
          className="flex-1 px-3.5 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="px-2.5 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl text-slate-700 focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <Button size="sm" variant="primary" type="submit" icon={Plus}>
          Add
        </Button>
      </form>

      {/* Categorized List */}
      <div className="space-y-5">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {category} ({items.filter((i) => i.checked).length}/{items.length})
            </h4>
            <div className="space-y-1.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${
                    item.checked
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-white border-slate-200/80 text-slate-800 hover:border-indigo-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => togglePackingItem(currentTrip.id, item.id)}
                    className="flex items-center gap-2.5 flex-1 text-left"
                  >
                    {item.checked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${item.checked ? 'line-through' : ''}`}>
                      {item.item}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => removePackingItem(currentTrip.id, item.id)}
                    className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PackingListWidget;
