import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { initialTrips } from '../data/mockTrips';
import { defaultChecklistCategories } from '../data/mockChecklists';
import { tripsApi, destinationsApi, itineraryApi, expensesApi, checklistsApi, communityApi } from '../services/api';
import confetti from 'canvas-confetti';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('globetrotter_trips');
    return saved ? JSON.parse(saved) : initialTrips;
  });

  const [activeTripId, setActiveTripId] = useState(() => {
    return trips[0]?.id || null;
  });

  // Saved Places State (Destinations, Attractions, Dining)
  const [savedPlaces, setSavedPlaces] = useState(() => {
    const saved = localStorage.getItem('globetrotter_saved_places');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'dest-goa',
            name: 'Goa',
            country: 'India',
            type: 'Destination',
            image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
            description: 'Golden beaches, Portuguese heritage churches, and coastal seafood.',
            rating: 4.9,
            avgCost: 3800,
          },
          {
            id: 'dest-jaipur',
            name: 'Jaipur',
            country: 'India',
            type: 'Destination',
            image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80',
            description: 'The Pink City famous for hilltop forts, Hawa Mahal, and royal palaces.',
            rating: 4.9,
            avgCost: 3400,
          },
          {
            id: 'dest-tokyo',
            name: 'Tokyo',
            country: 'Japan',
            type: 'Destination',
            image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
            description: 'Futuristic neon lights, historic Shinto shrines, ramen bars, and digital art.',
            rating: 4.9,
            avgCost: 14000,
          },
        ];
  });

  // Checklists per trip
  const [tripChecklists, setTripChecklists] = useState(() => {
    const saved = localStorage.getItem('globetrotter_checklists');
    return saved ? JSON.parse(saved) : {};
  });

  // Travel Documents Vault State
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('globetrotter_documents');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'doc-1',
            title: 'Republic of India Passport (Copy)',
            category: 'Passport & ID',
            tripId: null,
            tripTitle: 'Global / Personal',
            fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
            fileType: 'image/jpeg',
            fileName: 'passport_scan_2026.jpg',
            fileSize: '1.4 MB',
            issueDate: '2020-04-12',
            documentNumber: 'P7492019',
            notes: 'Primary biometric passport copy for international travel.',
            isPrivate: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'doc-2',
            title: 'Indigo Flight E-Ticket (DEL → GOI)',
            category: 'Flight & Train',
            tripId: 'trip-1',
            tripTitle: 'Goa Beach Escape',
            fileUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
            fileType: 'application/pdf',
            fileName: 'goa_flight_eticket.pdf',
            fileSize: '840 KB',
            issueDate: '2026-08-01',
            documentNumber: 'PNR: 6E-4819',
            notes: 'Terminal 3 departure at 07:45 AM. 20kg checked baggage included.',
            isPrivate: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'doc-3',
            title: 'Taj Exotica Resort Booking Voucher',
            category: 'Hotel Voucher',
            tripId: 'trip-1',
            tripTitle: 'Goa Beach Escape',
            fileUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            fileType: 'image/jpeg',
            fileName: 'taj_resort_booking.jpg',
            fileSize: '2.1 MB',
            issueDate: '2026-08-05',
            documentNumber: 'CONF-882194',
            notes: 'Sea View Suite with complimentary breakfast & airport transfers.',
            isPrivate: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'doc-4',
            title: 'HDFC Ergo Overseas Travel Insurance',
            category: 'Travel Insurance',
            tripId: null,
            tripTitle: 'Global / Personal',
            fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
            fileType: 'application/pdf',
            fileName: 'travel_insurance_policy.pdf',
            fileSize: '1.8 MB',
            issueDate: '2026-01-01',
            documentNumber: 'POL-99214-X',
            notes: 'Global emergency medical cover up to $250,000 + flight delay coverage.',
            isPrivate: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'doc-5',
            title: 'Japan Tourist E-Visa Approval',
            category: 'Visa & Permits',
            tripId: 'trip-3',
            tripTitle: 'Tokyo & Kyoto Cherry Blossom',
            fileUrl: 'https://images.unsplash.com/photo-1528164344705-47542687990d?auto=format&fit=crop&w=800&q=80',
            fileType: 'application/pdf',
            fileName: 'japan_evisa_grant.pdf',
            fileSize: '520 KB',
            issueDate: '2026-02-10',
            documentNumber: 'VISA-JP-9411',
            notes: 'Single entry 90-day tourist visa granted by Embassy of Japan.',
            isPrivate: false,
            createdAt: new Date().toISOString(),
          },
        ];
  });

  // Fetch initial data from backend REST API
  const refreshTripsFromBackend = useCallback(async () => {
    try {
      const res = await tripsApi.getAllTrips();
      if (res?.success && res.trips && res.trips.length > 0) {
        setTrips(res.trips);
      }
    } catch (e) {
      console.warn('[TripContext] Using cached trip state:', e.message);
    }
  }, []);

  const refreshSavedPlacesFromBackend = useCallback(async () => {
    try {
      const res = await destinationsApi.getSavedDestinations();
      if (res?.success && res.savedPlaces && res.savedPlaces.length > 0) {
        setSavedPlaces(res.savedPlaces);
      }
    } catch (e) {
      console.warn('[TripContext] Using cached saved places:', e.message);
    }
  }, []);

  useEffect(() => {
    refreshTripsFromBackend();
    refreshSavedPlacesFromBackend();
  }, [refreshTripsFromBackend, refreshSavedPlacesFromBackend]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('globetrotter_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('globetrotter_saved_places', JSON.stringify(savedPlaces));
  }, [savedPlaces]);

  useEffect(() => {
    localStorage.setItem('globetrotter_checklists', JSON.stringify(tripChecklists));
  }, [tripChecklists]);

  const activeTrip = useMemo(() => {
    return trips.find((t) => t.id === activeTripId || t._id === activeTripId) || trips[0] || null;
  }, [trips, activeTripId]);

  const getTripById = useCallback(
    (id) => {
      return trips.find((t) => t.id === id || t._id === id) || null;
    },
    [trips]
  );

  const createTrip = async (tripData) => {
    const start = new Date(tripData.startDate || Date.now());
    const end = new Date(tripData.endDate || Date.now() + 86400000 * 3);
    const diffTime = Math.abs(end - start);
    const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    // Initial days generation
    const initialDays = [];
    for (let i = 1; i <= durationDays; i++) {
      const dayDate = new Date(start);
      dayDate.setDate(start.getDate() + (i - 1));
      const dateStr = dayDate.toISOString().split('T')[0];

      const cityName = tripData.cities?.[0]?.name || tripData.startingCity || 'Destination';
      initialDays.push({
        dayNumber: i,
        date: dateStr,
        city: cityName,
        cityName: cityName,
        activities: [],
      });
    }

    const newTripLocal = {
      id: 'trip-' + Date.now(),
      _id: 'trip-' + Date.now(),
      title: tripData.title || 'My Unforgettable Trip',
      name: tripData.title || 'My Unforgettable Trip',
      description: tripData.description || 'Exciting multi-city adventure.',
      coverImage: tripData.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      startDate: tripData.startDate || new Date().toISOString().split('T')[0],
      endDate: tripData.endDate || new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
      durationDays,
      travelersCount: Number(tripData.travelersCount) || 2,
      travelers: Number(tripData.travelersCount) || 2,
      budget: Number(tripData.budget) || 40000,
      budgetBreakdown: tripData.budgetBreakdown || {
        flights: Math.round((Number(tripData.budget) || 40000) * 0.25),
        accommodation: Math.round((Number(tripData.budget) || 40000) * 0.35),
        food: Math.round((Number(tripData.budget) || 40000) * 0.15),
        transportation: Math.round((Number(tripData.budget) || 40000) * 0.10),
        activities: Math.round((Number(tripData.budget) || 40000) * 0.10),
        shopping: Math.round((Number(tripData.budget) || 40000) * 0.05),
      },
      travelStyle: tripData.travelStyle || 'Balanced',
      interests: tripData.interests || ['Culture', 'Sightseeing'],
      status: 'Upcoming',
      isPublic: false,
      shareId: 'trip-' + Math.random().toString(36).substring(2, 9),
      cities: tripData.cities?.length ? tripData.cities : [
        {
          id: 'stop-' + Date.now(),
          cityId: 'city-mumbai',
          name: tripData.startingCity || 'Mumbai',
          country: 'India',
          coordinates: [18.9220, 72.8347],
          nights: durationDays,
          arrivalDate: tripData.startDate,
          departureDate: tripData.endDate,
          transitToNext: null,
        }
      ],
      days: initialDays,
      expenses: [
        { id: 'exp-init-1', category: 'Transport', description: 'Intercity travel / flight reserve', amount: Math.round((Number(tripData.budget) || 40000) * 0.25), date: tripData.startDate },
        { id: 'exp-init-2', category: 'Accommodation', description: 'Hotel stays & boutique villas', amount: Math.round((Number(tripData.budget) || 40000) * 0.35), date: tripData.startDate },
      ],
      packingList: [
        { id: 'p-default-1', item: 'Government photo ID & Tickets', category: 'Documents', checked: false },
        { id: 'p-default-2', item: 'Phone charger & Power bank', category: 'Electronics', checked: false },
        { id: 'p-default-3', item: 'Comfortable walking shoes', category: 'Clothing', checked: false },
        { id: 'p-default-4', item: 'Sunscreen & Personal toiletries', category: 'Toiletries', checked: false },
      ]
    };

    setTrips((prev) => [newTripLocal, ...prev]);
    setActiveTripId(newTripLocal.id);

    // Call backend
    try {
      const res = await tripsApi.createTrip(newTripLocal);
      if (res?.success && res.trip) {
        setTrips((prev) => prev.map((t) => (t.id === newTripLocal.id ? { ...t, ...res.trip } : t)));
      }
    } catch (e) {
      console.warn('[TripContext] Backend createTrip sync:', e.message);
    }

    return newTripLocal;
  };

  const updateTrip = async (id, updates) => {
    setTrips((prev) =>
      prev.map((trip) => (trip.id === id || trip._id === id ? { ...trip, ...updates } : trip))
    );

    try {
      await tripsApi.updateTrip(id, updates);
    } catch (e) {
      console.warn('[TripContext] Backend updateTrip sync:', e.message);
    }
  };

  const duplicateTrip = async (tripId) => {
    const orig = getTripById(tripId);
    if (!orig) return null;

    const cloned = {
      ...JSON.parse(JSON.stringify(orig)),
      id: 'trip-' + Date.now(),
      _id: 'trip-' + Date.now(),
      title: `${orig.title || orig.name} (Copy)`,
      name: `${orig.title || orig.name} (Copy)`,
      shareId: 'trip-' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };

    setTrips((prev) => [cloned, ...prev]);
    setActiveTripId(cloned.id);

    try {
      await tripsApi.duplicateTrip(tripId);
    } catch (e) {}

    return cloned;
  };

  const deleteTrip = async (id) => {
    setTrips((prev) => {
      const remaining = prev.filter((t) => t.id !== id && t._id !== id);
      if (activeTripId === id) {
        setActiveTripId(remaining[0]?.id || null);
      }
      return remaining;
    });

    try {
      await tripsApi.deleteTrip(id);
    } catch (e) {
      console.warn('[TripContext] Backend deleteTrip sync:', e.message);
    }
  };

  const addCityToTrip = async (tripId, cityData) => {
    const newStop = {
      id: 'stop-' + Date.now(),
      cityId: cityData.id || ('city-' + cityData.name.toLowerCase()),
      name: cityData.name,
      country: cityData.country || 'India',
      coordinates: cityData.coordinates || [15.2993, 74.1240],
      nights: cityData.nights || 2,
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId && trip._id !== tripId) return trip;
        const updatedCities = [...(trip.cities || []), newStop];
        const nextDayNum = (trip.days?.length || 0) + 1;
        const lastDayDate = new Date(trip.days?.[trip.days?.length - 1]?.date || trip.startDate || Date.now());
        lastDayDate.setDate(lastDayDate.getDate() + 1);

        const newDay = {
          dayNumber: nextDayNum,
          date: lastDayDate.toISOString().split('T')[0],
          city: newStop.name,
          cityName: newStop.name,
          activities: [],
        };

        return {
          ...trip,
          cities: updatedCities,
          days: [...(trip.days || []), newDay],
          durationDays: (trip.days?.length || 0) + 1,
        };
      })
    );

    try {
      await tripsApi.addStop(tripId, newStop);
    } catch (e) {}
  };

  const removeCityFromTrip = (tripId, stopId) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId && trip._id !== tripId) return trip;
        if (trip.cities?.length <= 1) return trip;
        const updatedCities = trip.cities.filter((c) => c.id !== stopId);
        return {
          ...trip,
          cities: updatedCities,
        };
      })
    );
  };

  const reorderCities = (tripId, newCitiesOrder) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId && trip._id !== tripId) return trip;
        return {
          ...trip,
          cities: newCitiesOrder,
        };
      })
    );
  };

  const addActivityToDay = async (tripId, dayNumber, activity) => {
    const newAct = {
      id: 'act-' + Date.now(),
      activityId: 'act-' + Date.now(),
      title: activity.title || activity.name,
      name: activity.title || activity.name,
      time: activity.time || activity.startTime || '10:00',
      startTime: activity.time || activity.startTime || '10:00',
      durationMinutes: Number(activity.durationMinutes) || 60,
      cost: Number(activity.cost || activity.estimatedCost) || 0,
      estimatedCost: Number(activity.cost || activity.estimatedCost) || 0,
      category: activity.category || 'Sightseeing',
      location: activity.location || '',
      notes: activity.notes || '',
      timeOfDay: activity.timeOfDay || (activity.time < '12:00' ? 'Morning' : activity.time < '17:00' ? 'Afternoon' : 'Evening'),
      completed: false,
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId && trip._id !== tripId) return trip;
        const updatedDays = (trip.days || []).map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: [...(day.activities || []), newAct].sort((a, b) =>
              (a.time || '00:00').localeCompare(b.time || '00:00')
            ),
          };
        });
        return { ...trip, days: updatedDays };
      })
    );

    try {
      await itineraryApi.addActivity(tripId, dayNumber, newAct);
    } catch (e) {
      console.warn('[TripContext] Backend addActivity sync:', e.message);
    }

    return newAct;
  };

  const removeActivity = async (tripId, dayNumber, activityId) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId && trip._id !== tripId) return trip;
        const updatedDays = (trip.days || []).map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: (day.activities || []).filter((a) => a.id !== activityId && a.activityId !== activityId),
          };
        });
        return { ...trip, days: updatedDays };
      })
    );

    try {
      await itineraryApi.deleteActivity(activityId);
    } catch (e) {}
  };

  const updateActivity = async (tripId, dayNumber, activityId, updates) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId && trip._id !== tripId) return trip;
        const updatedDays = (trip.days || []).map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: (day.activities || []).map((a) =>
              a.id === activityId || a.activityId === activityId ? { ...a, ...updates } : a
            ),
          };
        });
        return { ...trip, days: updatedDays };
      })
    );

    try {
      await itineraryApi.updateActivity(activityId, updates);
    } catch (e) {}
  };

  const toggleActivityCompleted = async (tripId, dayNumber, activityId) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId && trip._id !== tripId) return trip;
        const updatedDays = (trip.days || []).map((day) => {
          if (day.dayNumber !== dayNumber) return day;
          return {
            ...day,
            activities: (day.activities || []).map((a) =>
              a.id === activityId || a.activityId === activityId ? { ...a, completed: !a.completed } : a
            ),
          };
        });
        return { ...trip, days: updatedDays };
      })
    );

    try {
      await itineraryApi.toggleActivityCompleted(activityId);
    } catch (e) {}
  };

  const addExpense = async (tripId, expense) => {
    const newExp = {
      id: 'exp-' + Date.now(),
      _id: 'exp-' + Date.now(),
      tripId,
      description: expense.description || expense.title,
      title: expense.description || expense.title,
      category: expense.category || 'Other',
      amount: Number(expense.amount) || 0,
      currency: expense.currency || 'INR',
      date: expense.date || new Date().toISOString().split('T')[0],
      notes: expense.notes || '',
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId && trip._id !== tripId) return trip;
        return {
          ...trip,
          expenses: [newExp, ...(trip.expenses || [])],
        };
      })
    );

    try {
      await expensesApi.addExpense(tripId, newExp);
    } catch (e) {
      console.warn('[TripContext] Backend addExpense sync:', e.message);
    }

    return newExp;
  };

  const deleteExpense = async (tripId, expenseId) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId && trip._id !== tripId) return trip;
        return {
          ...trip,
          expenses: (trip.expenses || []).filter((e) => e.id !== expenseId && e._id !== expenseId),
        };
      })
    );

    try {
      await expensesApi.deleteExpense(expenseId);
    } catch (e) {}
  };

  const togglePackingItem = (tripId, itemId) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId && trip._id !== tripId) return trip;
        return {
          ...trip,
          packingList: (trip.packingList || []).map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      })
    );
  };

  const addPackingItem = (tripId, item) => {
    const newItem = {
      id: 'p-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      item: item.item || item.name,
      category: item.category || 'General',
      checked: false,
    };

    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId && trip._id !== tripId) return trip;
        return {
          ...trip,
          packingList: [...(trip.packingList || []), newItem],
        };
      })
    );
    return newItem;
  };

  const removePackingItem = (tripId, itemId) => {
    setTrips((prev) =>
      prev.map((trip) => {
        if (trip.id !== tripId && trip._id !== tripId) return trip;
        return {
          ...trip,
          packingList: (trip.packingList || []).filter((i) => i.id !== itemId),
        };
      })
    );
  };

  // Saved Places Handlers
  const toggleSavePlace = async (place) => {
    const exists = savedPlaces.some((p) => p.id === place.id || p.destinationId === place.id);
    if (exists) {
      setSavedPlaces((prev) => prev.filter((p) => p.id !== place.id && p.destinationId !== place.id));
      try {
        await destinationsApi.unsaveDestination(place.id);
      } catch (e) {}
    } else {
      const newSaved = {
        id: place.id,
        destinationId: place.id,
        name: place.name,
        country: place.country || 'India',
        type: place.type || 'Destination',
        image: place.image,
        description: place.description || place.shortDescription || '',
        rating: place.rating || 4.8,
        avgCost: place.avgDailyCost || 3500,
        coordinates: place.coordinates || [18.9220, 72.8347],
      };
      setSavedPlaces((prev) => [newSaved, ...prev]);
      try {
        await destinationsApi.saveDestination(place.id, newSaved);
      } catch (e) {}
    }
  };

  const isSaved = (placeId) => {
    return savedPlaces.some((p) => p.id === placeId || p.destinationId === placeId);
  };

  const removeSavedPlace = async (placeId) => {
    setSavedPlaces((prev) => prev.filter((p) => p.id !== placeId && p.destinationId !== placeId));
    try {
      await destinationsApi.unsaveDestination(placeId);
    } catch (e) {}
  };

  // Trip Checklist Handlers
  const getTripChecklist = (tripId) => {
    if (tripChecklists[tripId]) return tripChecklists[tripId];
    return defaultChecklistCategories;
  };

  const toggleChecklistItem = (tripId, categoryId, itemId) => {
    setTripChecklists((prev) => {
      const currentList = prev[tripId] || defaultChecklistCategories;
      const updated = currentList.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      });
      return { ...prev, [tripId]: updated };
    });
  };

  const addChecklistItem = (tripId, categoryId, text) => {
    const newItem = {
      id: 'chk-' + Date.now(),
      text,
      completed: false,
      essential: false,
    };

    setTripChecklists((prev) => {
      const currentList = prev[tripId] || defaultChecklistCategories;
      const updated = currentList.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: [...cat.items, newItem],
        };
      });
      return { ...prev, [tripId]: updated };
    });
    return newItem;
  };

  const deleteChecklistItem = (tripId, categoryId, itemId) => {
    setTripChecklists((prev) => {
      const currentList = prev[tripId] || defaultChecklistCategories;
      const updated = currentList.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.filter((item) => item.id !== itemId),
        };
      });
      return { ...prev, [tripId]: updated };
    });
  };

  // Fork Community Trip
  const forkCommunityTrip = async (communityTrip) => {
    const clonedTrip = {
      id: 'trip-' + Date.now(),
      _id: 'trip-' + Date.now(),
      title: communityTrip.title,
      name: communityTrip.title,
      description: communityTrip.description,
      coverImage: communityTrip.coverImage,
      startDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * (7 + communityTrip.durationDays)).toISOString().split('T')[0],
      durationDays: communityTrip.durationDays,
      travelersCount: 2,
      travelers: 2,
      budget: communityTrip.budget,
      travelStyle: communityTrip.tags?.[0] || 'Balanced',
      interests: communityTrip.tags || ['Culture', 'Sightseeing'],
      status: 'Upcoming',
      isPublic: false,
      shareId: 'trip-' + Math.random().toString(36).substring(2, 9),
      cities: communityTrip.destinations?.map((destName, i) => ({
        id: `stop-cloned-${Date.now()}-${i}`,
        name: destName,
        country: 'India',
        coordinates: [18.9220, 72.8347],
        nights: Math.ceil(communityTrip.durationDays / (communityTrip.destinations?.length || 1)),
      })) || [],
      days: Array.from({ length: communityTrip.durationDays }, (_, i) => ({
        dayNumber: i + 1,
        date: new Date(Date.now() + 86400000 * (7 + i)).toISOString().split('T')[0],
        city: communityTrip.destinations?.[i % (communityTrip.destinations?.length || 1)] || 'Destination',
        cityName: communityTrip.destinations?.[i % (communityTrip.destinations?.length || 1)] || 'Destination',
        activities: [
          {
            id: `act-cloned-${i}-1`,
            title: `Explore Highlights of ${communityTrip.destinations?.[0] || 'City'}`,
            time: '10:00',
            startTime: '10:00',
            durationMinutes: 120,
            cost: 800,
            category: 'Sightseeing',
            location: 'City Center',
            notes: 'Curated by community explorer.',
            completed: false,
          }
        ]
      })),
      expenses: [
        { id: `exp-cloned-1`, category: 'Accommodation', description: 'Boutique stay', amount: Math.round(communityTrip.budget * 0.4), date: new Date().toISOString().split('T')[0] },
      ],
      packingList: [
        { id: 'p-1', item: 'Passport & tickets', category: 'Documents', checked: false },
      ]
    };

    setTrips((prev) => [clonedTrip, ...prev]);
    setActiveTripId(clonedTrip.id);

    try {
      await communityApi.forkTrip(communityTrip.id);
    } catch (e) {}

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    return clonedTrip;
  };

  // Schedule Conflict Detection
  const detectScheduleConflicts = (trip) => {
    if (!trip || !trip.days) return [];
    const conflicts = [];

    trip.days.forEach((day) => {
      const transitActivity = day.activities?.find(
        (a) =>
          a.category === 'Transport' ||
          a.title?.toLowerCase().includes('transit') ||
          a.title?.toLowerCase().includes('train') ||
          a.title?.toLowerCase().includes('flight')
      );

      if (transitActivity && transitActivity.time) {
        const [transH, transM] = transitActivity.time.split(':').map(Number);
        const transitStartMinutes = transH * 60 + transM;
        const transitArrivalMinutes = transitStartMinutes + (transitActivity.durationMinutes || 0);

        day.activities.forEach((act) => {
          if (act.id === transitActivity.id || !act.time) return;
          const [actH, actM] = act.time.split(':').map(Number);
          const actStartMinutes = actH * 60 + actM;

          if (actStartMinutes < transitArrivalMinutes) {
            const arrH = Math.floor((transitArrivalMinutes + 30) / 60);
            const arrM = (transitArrivalMinutes + 30) % 60;
            const suggestedTime = `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`;

            conflicts.push({
              dayNumber: day.dayNumber,
              cityName: day.cityName || day.city,
              date: day.date,
              transitTitle: transitActivity.title,
              transitArrivalTime: `${String(Math.floor(transitArrivalMinutes / 60)).padStart(2, '0')}:${String(transitArrivalMinutes % 60).padStart(2, '0')}`,
              conflictingActivityId: act.id,
              conflictingActivityTitle: act.title,
              conflictingActivityTime: act.time,
              suggestedTime,
            });
          }
        });
      }
    });

    return conflicts;
  };

  const resolveConflict = (tripId, dayNumber, activityId, newTime) => {
    updateActivity(tripId, dayNumber, activityId, { time: newTime });
  };

  // Budget Math Calculation
  const calculateTripBudgetSummary = (trip) => {
    if (!trip) {
      return {
        totalBudget: 45000,
        totalSpent: 0,
        remainingBalance: 45000,
        percentageUsed: 0,
        status: 'under',
        statusMessage: 'Optimal: On track within allocated budget.',
        categories: [],
        dailySpending: [],
      };
    }

    const totalBudget = Number(trip.budget) || 1;
    const directExpenses = (trip.expenses || []).reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0
    );

    const activityCosts = (trip.days || []).reduce((sum, day) => {
      return sum + (day.activities || []).reduce((dSum, act) => dSum + (Number(act.cost || act.estimatedCost) || 0), 0);
    }, 0);

    const totalSpent = directExpenses + activityCosts;
    const remainingBalance = Math.max(0, totalBudget - totalSpent);
    const percentageUsed = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

    let status = 'under';
    let statusMessage = 'Optimal: On track within allocated budget.';
    if (totalSpent > totalBudget) {
      status = 'over';
      statusMessage = `Budget Exceeded: Overspent by ₹${(totalSpent - totalBudget).toLocaleString('en-IN')}`;
    } else if (percentageUsed >= 85) {
      status = 'near';
      statusMessage = `Approaching Limit: ${100 - percentageUsed}% budget remaining.`;
    }

    const catTotals = {
      Transport: 0,
      Accommodation: 0,
      Food: 0,
      Activities: activityCosts,
      Other: 0,
    };

    (trip.expenses || []).forEach((exp) => {
      const cat = exp.category || 'Other';
      if (catTotals[cat] !== undefined) {
        catTotals[cat] += Number(exp.amount) || 0;
      } else {
        catTotals.Other += Number(exp.amount) || 0;
      }
    });

    const categoryColors = {
      Transport: '#3E8EDE',
      Accommodation: '#714B67',
      Food: '#F0A63F',
      Activities: '#2AB79B',
      Other: '#F16E62',
    };

    const categories = Object.keys(catTotals).map((key) => ({
      name: key,
      value: catTotals[key],
      color: categoryColors[key] || '#714B67',
    }));

    const dailySpending = (trip.days || []).map((d) => {
      const spent = (d.activities || []).reduce((sum, a) => sum + (Number(a.cost || a.estimatedCost) || 0), 0);
      return {
        day: `Day ${d.dayNumber}`,
        city: d.cityName || d.city,
        amount: spent,
      };
    });

    return {
      totalBudget,
      totalSpent,
      remainingBalance,
      percentageUsed,
      status,
      statusMessage,
      categories,
      dailySpending,
    };
  };

  useEffect(() => {
    localStorage.setItem('globetrotter_documents', JSON.stringify(documents));
  }, [documents]);

  const addDocument = (docData) => {
    const newDoc = {
      id: 'doc-' + Date.now(),
      createdAt: new Date().toISOString(),
      ...docData,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const updateDocument = (id, updatedData) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id || d._id === id ? { ...d, ...updatedData } : d))
    );
  };

  const deleteDocument = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id && d._id !== id));
  };

  const getDocumentsForTrip = useCallback(
    (tripId) => {
      if (!tripId) return documents;
      return documents.filter((d) => d.tripId === tripId);
    },
    [documents]
  );

  return (
    <TripContext.Provider
      value={{
        trips,
        activeTrip,
        activeTripId,
        setActiveTripId,
        getTripById,
        createTrip,
        updateTrip,
        duplicateTrip,
        deleteTrip,
        addCityToTrip,
        removeCityFromTrip,
        reorderCities,
        addActivityToDay,
        removeActivity,
        updateActivity,
        toggleActivityCompleted,
        addExpense,
        deleteExpense,
        togglePackingItem,
        addPackingItem,
        removePackingItem,
        savedPlaces,
        toggleSavePlace,
        isSaved,
        removeSavedPlace,
        getTripChecklist,
        toggleChecklistItem,
        addChecklistItem,
        deleteChecklistItem,
        forkCommunityTrip,
        detectScheduleConflicts,
        resolveConflict,
        calculateTripBudgetSummary,
        refreshTripsFromBackend,
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        getDocumentsForTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}

export default TripContext;
