import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import TripHeader from '../components/trip/TripHeader';
import Modal from '../components/common/Modal';
import ActivityCard from '../components/trip/ActivityCard';
import Button from '../components/common/Button';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Plus,
  Compass,
  Train,
  CheckCircle2,
} from 'lucide-react';

export function CalendarPage() {
  const { id } = useParams();
  const { trips, getTripById, toggleActivityCompleted } = useTrips();
  const { formatMoney } = useAuth();

  const trip = getTripById(id) || trips[0];
  const [selectedDayModal, setSelectedDayModal] = useState(null);

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Trip not found.</p>
        <Link to="/trips" className="text-indigo-600 font-bold text-xs mt-2 inline-block">
          Return to My Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* Trip Header */}
      <TripHeader trip={trip} activeTab="calendar" />

      {/* Calendar Header Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            Visual Travel Timeline & Calendar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Overview of multi-city spans, scheduled daily tours, and transit transition days.
          </p>
        </div>

        <Link to={`/trips/${trip.id}/itinerary`}>
          <Button size="sm" variant="primary" icon={Plus}>
            Edit in Builder
          </Button>
        </Link>
      </div>

      {/* Multi-City Journey Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trip.days?.map((day) => {
          const isTransitDay = day.activities?.some(
            (a) => a.category === 'Transport' || a.title.toLowerCase().includes('transit')
          );

          const totalDayCost = (day.activities || []).reduce(
            (sum, a) => sum + (Number(a.cost) || 0),
            0
          );

          return (
            <div
              key={day.dayNumber}
              onClick={() => setSelectedDayModal(day)}
              className="group cursor-pointer rounded-3xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all card-hover flex flex-col justify-between"
            >
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-xs flex items-center justify-center border border-indigo-100">
                      D{day.dayNumber}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{day.cityName || day.city}</h4>
                      <p className="text-[11px] text-slate-400 font-medium">{day.date}</p>
                    </div>
                  </div>

                  {isTransitDay && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      <Train className="w-3 h-3" /> Transit Day
                    </span>
                  )}
                </div>

                {/* Day Activities Snippet */}
                <div className="space-y-2 mb-4">
                  {day.activities?.length > 0 ? (
                    day.activities.slice(0, 3).map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-bold text-[11px] text-slate-600">{act.time}</span>
                          <span className="text-slate-800 font-medium truncate">{act.title}</span>
                        </div>
                        {act.cost > 0 && (
                          <span className="text-[10px] font-bold text-emerald-600 shrink-0 ml-1">
                            {formatMoney(act.cost)}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic py-3 text-center">
                      Free exploration day
                    </p>
                  )}

                  {day.activities?.length > 3 && (
                    <p className="text-[11px] font-bold text-indigo-600 text-center">
                      + {day.activities.length - 3} more activities
                    </p>
                  )}
                </div>
              </div>

              {/* Day Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">
                  {day.activities?.length || 0} items planned
                </span>
                <span className="font-extrabold text-slate-900">
                  Est. {formatMoney(totalDayCost)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Details Modal */}
      {selectedDayModal && (
        <Modal
          isOpen={!!selectedDayModal}
          onClose={() => setSelectedDayModal(null)}
          title={`Day ${selectedDayModal.dayNumber}: ${selectedDayModal.cityName || selectedDayModal.city}`}
          subtitle={`Schedule for ${selectedDayModal.date}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            {selectedDayModal.activities?.length > 0 ? (
              <div className="space-y-3">
                {selectedDayModal.activities.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onToggleComplete={() =>
                      toggleActivityCompleted(trip.id, selectedDayModal.dayNumber, act.id)
                    }
                    readOnly={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No activities scheduled for this day yet.
              </p>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <Link to={`/trips/${trip.id}/itinerary`}>
                <Button size="sm" variant="outline" icon={Plus}>
                  Add Activities in Builder
                </Button>
              </Link>
              <Button size="sm" variant="primary" onClick={() => setSelectedDayModal(null)}>
                Close View
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CalendarPage;
