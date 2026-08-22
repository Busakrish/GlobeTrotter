import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import PackingListWidget from '../components/packing/PackingListWidget';
import WeatherCard from '../components/weather/WeatherCard';
import Button from '../components/common/Button';
import {
  CheckSquare,
  Sparkles,
  Plus,
} from 'lucide-react';

const PACKING_TEMPLATES = {
  beach: [
    { item: 'High-SPF Sunscreen & After-Sun Aloe', category: 'Toiletries' },
    { item: 'Quick-dry swimsuits & Microfiber beach towels', category: 'Clothing' },
    { item: 'Polarized UV Sunglasses & Sun hat', category: 'Essentials' },
    { item: 'Waterproof phone dry-bag & Action camera', category: 'Electronics' },
    { item: 'Water shoes / Flip flops', category: 'Footwear' },
  ],
  heritage: [
    { item: 'Comfortable walking sneakers with good grip', category: 'Footwear' },
    { item: 'Modest cotton outfits for temple & palace entries', category: 'Clothing' },
    { item: 'Wide-brim sunhat & cooling mist spray', category: 'Essentials' },
    { item: 'Camera with zoom lens & extra SD card', category: 'Electronics' },
    { item: 'Hand sanitizer & electrolyte powder sachets', category: 'Toiletries' },
  ],
  winter: [
    { item: 'Thermal base layers & Merino wool socks', category: 'Clothing' },
    { item: 'Water-resistant windproof down jacket', category: 'Clothing' },
    { item: 'Lip balm & heavy moisturizing lotion', category: 'Toiletries' },
    { item: 'Touchscreen-compatible thermal gloves', category: 'Essentials' },
    { item: 'Insulated trekking boots with ankle support', category: 'Footwear' },
  ]
};

export function PackingList() {
  const { trips, activeTrip, setActiveTripId, addPackingItem } = useTrips();
  const { notifySuccess } = useNotification();

  const selectedTrip = activeTrip || (trips.length > 0 ? trips[0] : null);
  const firstCity = selectedTrip?.cities?.[0]?.name || selectedTrip?.destination || 'Mumbai';

  if (!selectedTrip) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
        <CheckSquare className="w-12 h-12 text-[#714B67] mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Trip</h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-4">
          Create or select a trip to manage your destination-specific packing list.
        </p>
        <Link to="/trips/create">
          <Button variant="primary" size="sm" icon={Plus}>
            Plan a Trip
          </Button>
        </Link>
      </div>
    );
  }

  const handleApplyTemplate = (templateKey, templateName) => {
    const items = PACKING_TEMPLATES[templateKey];
    if (!items || !selectedTrip) return;

    items.forEach((item) => {
      addPackingItem(selectedTrip.id, item);
    });

    notifySuccess(`Added ${items.length} items from "${templateName}" pack!`);
  };

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            AI Climate & Activity Checklist
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Smart Packing Assistant
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dynamic packing suggestions synced with your destinations, weather forecasts, and trip durations.
          </p>
        </div>

        {/* Trip Switcher */}
        {trips.length > 0 && (
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-500 pl-2">Trip:</span>
            <select
              value={selectedTrip?.id}
              onChange={(e) => setActiveTripId(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none pr-3"
            >
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.durationDays}D)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Weather Insight & Packing Pack Templates Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Weather and Smart Packs */}
        <div className="lg:col-span-5 space-y-6">
          <WeatherCard cityName={firstCity} />

          {/* Quick 1-Click Smart Pack Inserters */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              1-Click Packing Templates
            </h3>
            <p className="text-xs text-slate-500">
              Instantly insert curated essential bundles into your checklist:
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleApplyTemplate('beach', 'Beach & Coastal Explorer')}
                className="flex items-center justify-between w-full p-3 rounded-2xl bg-sky-50/70 hover:bg-sky-100/70 border border-sky-200/80 text-left transition-colors group"
              >
                <div>
                  <h4 className="text-xs font-bold text-sky-950">🏖️ Beach & Coastal Pack</h4>
                  <p className="text-[11px] text-sky-700">Sunscreen, swimsuits, dry-bag, sunglasses</p>
                </div>
                <Plus className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleApplyTemplate('heritage', 'Heritage & Forts Explorer')}
                className="flex items-center justify-between w-full p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200/80 text-left transition-colors group"
              >
                <div>
                  <h4 className="text-xs font-bold text-amber-950">🏰 Heritage & Palaces Pack</h4>
                  <p className="text-[11px] text-amber-700">Walking shoes, modesty wear, camera gear</p>
                </div>
                <Plus className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleApplyTemplate('winter', 'Himalayas & Alpine Pack')}
                className="flex items-center justify-between w-full p-3 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/80 text-left transition-colors group"
              >
                <div>
                  <h4 className="text-xs font-bold text-indigo-950">🏔️ Alpine & Cold Weather Pack</h4>
                  <p className="text-[11px] text-indigo-700">Thermals, down jacket, boots, gloves</p>
                </div>
                <Plus className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Full Interactive Packing Checklist Widget */}
        <div className="lg:col-span-7">
          <PackingListWidget tripId={selectedTrip?.id} initialList={selectedTrip?.packingList || []} />
        </div>
      </div>
    </div>
  );
}

export default PackingList;
