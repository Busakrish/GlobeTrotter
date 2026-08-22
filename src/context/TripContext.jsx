import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  tripsApi,
  destinationsApi,
  itineraryApi,
  expensesApi,
  checklistsApi,
  communityApi,
  documentsApi,
} from '../services/api';
import confetti from 'canvas-confetti';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  // 1. Core State — Initialized strictly from database records (empty initially)
  const [trips, setTrips] = useState([]);
  const [activeTripId, setActiveTripId] = useState(null);
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [tripChecklists, setTripChecklists] = useState({});
  const [documents, setDocuments] = useState([]);
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch reference catalogs from database
  const fetchReferenceCatalogs = useCallback(async () => {
    try {
      const [citiesRes, activitiesRes] = await Promise.all([
        destinationsApi.getCities().catch(() => ({ cities: [] })),
        destinationsApi.getActivities().catch(() => ({ activities: [] })),
      ]);
      if (citiesRes?.cities) setCities(citiesRes.cities);
      if (activitiesRes?.activities) setActivities(activitiesRes.activities);
    } catch (e) {
      console.warn('[TripContext] Catalog fetch notice:', e.message);
    }
  }, []);

  // 3. Fetch user trips and records from backend database
  const refreshTripsFromBackend = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tripsApi.getAllTrips();
      if (res?.success && Array.isArray(res.trips)) {
        setTrips(res.trips);
        if (res.trips.length > 0) {
          setActiveTripId((prev) => {
            const exists = res.trips.some((t) => t.id === prev || t._id === prev);
            return exists ? prev : (res.trips[0].id || res.trips[0]._id);
          });
        } else {
          setActiveTripId(null);
        }
      }
    } catch (e) {
      console.warn('[TripContext] Error fetching trips:', e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSavedPlacesFromBackend = useCallback(async () => {
    try {
      const res = await destinationsApi.getSavedDestinations();
      if (res?.success && Array.isArray(res.savedPlaces)) {
        setSavedPlaces(res.savedPlaces);
      }
    } catch (e) {
      console.warn('[TripContext] Saved places notice:', e.message);
    }
  }, []);

  const refreshDocumentsFromBackend = useCallback(async () => {
    try {
      const res = await documentsApi.getAllDocuments();
      if (res?.success && Array.isArray(res.documents)) {
        setDocuments(res.documents);
      }
    } catch (e) {
      console.warn('[TripContext] Documents notice:', e.message);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchReferenceCatalogs();
    refreshTripsFromBackend();
    refreshSavedPlacesFromBackend();
    refreshDocumentsFromBackend();
  }, [fetchReferenceCatalogs, refreshTripsFromBackend, refreshSavedPlacesFromBackend, refreshDocumentsFromBackend]);

  // Derived Active Trip Object
  const activeTrip = useMemo(() => {
    if (!activeTripId) return trips[0] || null;
    return trips.find((t) => (t.id || t._id) === activeTripId) || trips[0] || null;
  }, [trips, activeTripId]);

  // Create Trip
  const createTrip = async (tripData) => {
    try {
      const res = await tripsApi.createTrip(tripData);
      if (res?.success && res.trip) {
        const newTrip = { ...res.trip, id: res.trip.id || res.trip._id };
        setTrips((prev) => [newTrip, ...prev]);
        setActiveTripId(newTrip.id);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
        return newTrip;
      }
    } catch (err) {
      console.warn('[TripContext] createTrip API error:', err.message);
      throw err;
    }
  };

  // Update Trip
  const updateTrip = async (tripId, updates) => {
    try {
      await tripsApi.updateTrip(tripId, updates);
      setTrips((prev) =>
        prev.map((t) => ((t.id || t._id) === tripId ? { ...t, ...updates } : t))
      );
    } catch (err) {
      console.warn('[TripContext] updateTrip error:', err.message);
    }
  };

  // Delete Trip with cascading cleanup
  const deleteTrip = async (tripId) => {
    try {
      await tripsApi.deleteTrip(tripId);
      setTrips((prev) => {
        const remaining = prev.filter((t) => (t.id || t._id) !== tripId);
        if (activeTripId === tripId) {
          setActiveTripId(remaining[0]?.id || null);
        }
        return remaining;
      });
      // Clean local sub-records
      setDocuments((prev) => prev.filter((d) => d.tripId !== tripId));
      setTripChecklists((prev) => {
        const copy = { ...prev };
        delete copy[tripId];
        return copy;
      });
    } catch (err) {
      console.warn('[TripContext] deleteTrip error:', err.message);
    }
  };

  // Duplicate Trip
  const duplicateTrip = async (tripId) => {
    try {
      const res = await tripsApi.duplicateTrip(tripId);
      if (res?.success && res.trip) {
        const cloned = { ...res.trip, id: res.trip.id || res.trip._id };
        setTrips((prev) => [cloned, ...prev]);
        setActiveTripId(cloned.id);
        return cloned;
      }
    } catch (err) {
      console.warn('[TripContext] duplicateTrip error:', err.message);
    }
  };

  // Add City Stop
  const addCityStop = async (tripId, cityStop) => {
    try {
      const stopObj = {
        ...cityStop,
        id: cityStop.id || 'stop-' + Date.now(),
        nights: Number(cityStop.nights) || 2,
      };
      await tripsApi.addStop(tripId, stopObj);
      setTrips((prev) =>
        prev.map((t) => {
          if ((t.id || t._id) === tripId) {
            const currentCities = t.cities || [];
            return { ...t, cities: [...currentCities, stopObj] };
          }
          return t;
        })
      );
      return stopObj;
    } catch (err) {
      console.warn('[TripContext] addCityStop error:', err.message);
    }
  };

  // Remove City Stop
  const removeCityStop = async (tripId, stopId) => {
    setTrips((prev) =>
      prev.map((t) => {
        if ((t.id || t._id) === tripId) {
          return { ...t, cities: (t.cities || []).filter((c) => c.id !== stopId) };
        }
        return t;
      })
    );
  };

  // Add Activity to Day
  const addActivityToDay = async (tripId, dayNumber, activityData) => {
    const actObj = {
      ...activityData,
      id: activityData.id || 'act-' + Date.now(),
      cost: Number(activityData.cost) || 0,
      completed: false,
    };

    try {
      await itineraryApi.addActivity(tripId, dayNumber, actObj);
    } catch (e) {
      console.warn(e);
    }

    setTrips((prev) =>
      prev.map((t) => {
        if ((t.id || t._id) === tripId) {
          const days = (t.days || []).map((d) => {
            if (d.dayNumber === dayNumber) {
              return { ...d, activities: [...(d.activities || []), actObj] };
            }
            return d;
          });
          return { ...t, days };
        }
        return t;
      })
    );
    return actObj;
  };

  // Toggle Activity Completed
  const toggleActivityCompleted = async (tripId, dayNumber, activityId) => {
    try {
      await itineraryApi.toggleActivityCompleted(activityId);
    } catch (e) {
      console.warn(e);
    }

    setTrips((prev) =>
      prev.map((t) => {
        if ((t.id || t._id) === tripId) {
          const days = (t.days || []).map((d) => {
            if (d.dayNumber === dayNumber) {
              const activities = (d.activities || []).map((a) =>
                (a.id || a._id) === activityId ? { ...a, completed: !a.completed } : a
              );
              return { ...d, activities };
            }
            return d;
          });
          return { ...t, days };
        }
        return t;
      })
    );
  };

  // Delete Activity
  const deleteActivity = async (tripId, dayNumber, activityId) => {
    try {
      await itineraryApi.deleteActivity(activityId);
    } catch (e) {
      console.warn(e);
    }

    setTrips((prev) =>
      prev.map((t) => {
        if ((t.id || t._id) === tripId) {
          const days = (t.days || []).map((d) => {
            if (d.dayNumber === dayNumber) {
              return {
                ...d,
                activities: (d.activities || []).filter((a) => (a.id || a._id) !== activityId),
              };
            }
            return d;
          });
          return { ...t, days };
        }
        return t;
      })
    );
  };

  // Add Expense
  const addExpense = async (tripId, expenseData) => {
    const expObj = {
      ...expenseData,
      id: expenseData.id || 'exp-' + Date.now(),
      amount: Number(expenseData.amount) || 0,
      currency: expenseData.currency || 'INR',
      date: expenseData.date || new Date().toISOString().split('T')[0],
    };

    try {
      await expensesApi.addExpense(tripId, expObj);
    } catch (e) {
      console.warn(e);
    }

    setTrips((prev) =>
      prev.map((t) => {
        if ((t.id || t._id) === tripId) {
          return { ...t, expenses: [expObj, ...(t.expenses || [])] };
        }
        return t;
      })
    );
    return expObj;
  };

  // Delete Expense
  const deleteExpense = async (tripId, expenseId) => {
    try {
      await expensesApi.deleteExpense(expenseId);
    } catch (e) {
      console.warn(e);
    }

    setTrips((prev) =>
      prev.map((t) => {
        if ((t.id || t._id) === tripId) {
          return {
            ...t,
            expenses: (t.expenses || []).filter((e) => (e.id || e._id) !== expenseId),
          };
        }
        return t;
      })
    );
  };

  // Save / Unsave Place
  const savePlace = async (place) => {
    const newPlace = {
      ...place,
      id: place.id || `place-${Date.now()}`,
    };
    try {
      await destinationsApi.saveDestination(newPlace.id, newPlace);
    } catch (e) {
      console.warn(e);
    }
    setSavedPlaces((prev) => [newPlace, ...prev]);
  };

  const removeSavedPlace = async (placeId) => {
    try {
      await destinationsApi.unsaveDestination(placeId);
    } catch (e) {
      console.warn(e);
    }
    setSavedPlaces((prev) => prev.filter((p) => p.id !== placeId && p.destinationId !== placeId));
  };

  const isPlaceSaved = (placeId) => {
    return savedPlaces.some((p) => p.id === placeId || p.destinationId === placeId);
  };

  // Document Vault State Actions
  const addDocument = async (docData) => {
    const newDoc = {
      ...docData,
      id: docData.id || `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    try {
      await documentsApi.createDocument(newDoc);
    } catch (e) {
      console.warn(e);
    }
    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const deleteDocument = async (id) => {
    try {
      await documentsApi.deleteDocument(id);
    } catch (e) {
      console.warn(e);
    }
    setDocuments((prev) => prev.filter((d) => d.id !== id && d._id !== id));
  };

  const getDocumentsForTrip = useCallback(
    (tripId) => {
      if (!tripId) return documents;
      return documents.filter((d) => d.tripId === tripId);
    },
    [documents]
  );

  // Budget Calculation Utility
  const calculateTripBudgetSummary = (trip) => {
    if (!trip) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        remainingBalance: 0,
        percentageUsed: 0,
        status: 'under',
        statusMessage: 'No trip budget active.',
        categories: [],
        dailySpending: [],
      };
    }

    const totalBudget = Number(trip.budget) || 0;
    const directExpenses = (trip.expenses || []).reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0
    );

    const activityCosts = (trip.days || []).reduce((sum, day) => {
      return sum + (day.activities || []).reduce((dSum, act) => dSum + (Number(act.cost || act.estimatedCost) || 0), 0);
    }, 0);

    const totalSpent = directExpenses + activityCosts;
    const remainingBalance = Math.max(0, totalBudget - totalSpent);
    const percentageUsed = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

    let status = 'under';
    let statusMessage = 'Optimal: On track within allocated budget.';
    if (totalSpent > totalBudget && totalBudget > 0) {
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

    const categories = Object.entries(catTotals).map(([name, spent]) => ({
      name,
      spent,
      allocated: Math.round(totalBudget * 0.2),
      color: categoryColors[name] || '#714B67',
    }));

    return {
      totalBudget,
      totalSpent,
      remainingBalance,
      percentageUsed,
      status,
      statusMessage,
      categories,
      dailySpending: [],
    };
  };

  const getTripById = useCallback(
    (id) => (trips || []).find((t) => (t.id || t._id) === id),
    [trips]
  );

  const isSaved = useCallback(
    (placeId) => (savedPlaces || []).some((p) => (p.id || p._id) === placeId || p.destinationId === placeId),
    [savedPlaces]
  );

  const toggleSavePlace = useCallback(
    (place) => {
      const pid = place.id || place._id;
      const alreadySaved = (savedPlaces || []).some((p) => (p.id || p._id) === pid || p.destinationId === pid);
      if (alreadySaved) {
        removeSavedPlace(pid);
      } else {
        savePlace(place);
      }
    },
    [savedPlaces, savePlace, removeSavedPlace]
  );

  const detectScheduleConflicts = useCallback(() => [], []);
  const resolveConflict = useCallback(() => {}, []);
  const reorderCities = useCallback((tripId, newCities) => updateTrip(tripId, { cities: newCities }), [updateTrip]);
  const removeActivity = useCallback((tripId, dayNum, actId) => deleteActivity(tripId, dayNum, actId), [deleteActivity]);
  const updateActivity = useCallback(() => {}, []);
  const addItineraryDay = useCallback(() => {}, []);
  const deleteItineraryDay = useCallback(() => {}, []);
  const updateItineraryDayCity = useCallback(() => {}, []);
  const getTripChecklist = useCallback(() => [], []);
  const addChecklistItem = useCallback(() => {}, []);
  const toggleChecklistItem = useCallback(() => {}, []);
  const deleteChecklistItem = useCallback(() => {}, []);
  const addPackingItem = useCallback(() => {}, []);
  const togglePackingItem = useCallback(() => {}, []);
  const removePackingItem = useCallback(() => {}, []);
  const forkCommunityTrip = useCallback((trip) => createTrip(trip), [createTrip]);

  return (
    <TripContext.Provider
      value={{
        trips: trips || [],
        activeTrip,
        activeTripId,
        setActiveTripId,
        savedPlaces: savedPlaces || [],
        tripChecklists: tripChecklists || {},
        documents: documents || [],
        cities: cities || [],
        activities: activities || [],
        loading,
        createTrip,
        updateTrip,
        deleteTrip,
        duplicateTrip,
        getTripById,
        addCityStop,
        removeCityStop,
        addCityToTrip: addCityStop,
        removeCityFromTrip: removeCityStop,
        reorderCities,
        addActivityToDay,
        toggleActivityCompleted,
        deleteActivity,
        removeActivity,
        updateActivity,
        addItineraryDay,
        deleteItineraryDay,
        updateItineraryDayCity,
        detectScheduleConflicts,
        resolveConflict,
        addExpense,
        deleteExpense,
        savePlace,
        removeSavedPlace,
        isPlaceSaved: isSaved,
        isSaved,
        toggleSavePlace,
        addDocument,
        deleteDocument,
        getDocumentsForTrip,
        calculateTripBudgetSummary,
        refreshTripsFromBackend,
        getTripChecklist,
        addChecklistItem,
        toggleChecklistItem,
        deleteChecklistItem,
        addPackingItem,
        togglePackingItem,
        removePackingItem,
        forkCommunityTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
};

export default TripContext;
