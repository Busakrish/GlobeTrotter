import axios from 'axios';

// Base Axios instance configured for Express REST API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for JWT token injection
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('globetrotter_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for response handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.warn('[GlobeTrotter API Error]:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// Authentication & Profile
export const authApi = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  updatePersonality: (data) => apiClient.post('/users/personality', data),
};

// Trips
export const tripsApi = {
  getAllTrips: () => apiClient.get('/trips'),
  getTripById: (id) => apiClient.get(`/trips/${id}`),
  createTrip: (tripData) => apiClient.post('/trips', tripData),
  updateTrip: (id, tripData) => apiClient.put(`/trips/${id}`, tripData),
  deleteTrip: (id) => apiClient.delete(`/trips/${id}`),
  duplicateTrip: (id) => apiClient.post(`/trips/${id}/duplicate`),
  addStop: (tripId, stopData) => apiClient.post(`/trips/${tripId}/stops`, stopData),
};

// Destinations
export const destinationsApi = {
  getDestinations: (params) => apiClient.get('/destinations', { params }),
  getDestinationById: (id) => apiClient.get(`/destinations/${id}`),
  saveDestination: (id, placeData) => apiClient.post(`/destinations/${id}/save`, placeData),
  unsaveDestination: (id) => apiClient.delete(`/destinations/${id}/save`),
  getSavedDestinations: () => apiClient.get('/destinations/saved'),
};

// Itinerary
export const itineraryApi = {
  getTripItinerary: (tripId) => apiClient.get(`/trips/${tripId}/itinerary`),
  addDay: (tripId, dayData) => apiClient.post(`/trips/${tripId}/days`, dayData),
  deleteDay: (dayId) => apiClient.delete(`/days/${dayId}`),
  addActivity: (tripId, dayNumber, activityData) =>
    apiClient.post(`/trips/${tripId}/days/${dayNumber}/activities`, activityData),
  updateActivity: (id, activityData) => apiClient.put(`/activities/${id}`, activityData),
  deleteActivity: (id) => apiClient.delete(`/activities/${id}`),
  toggleActivityCompleted: (id) => apiClient.post(`/activities/${id}/toggle`),
  reorderActivities: (dayId, activities) => apiClient.post(`/days/${dayId}/reorder`, { activities }),
};

// Expenses & Budget
export const expensesApi = {
  getTripExpenses: (tripId) => apiClient.get(`/trips/${tripId}/expenses`),
  addExpense: (tripId, expenseData) => apiClient.post(`/trips/${tripId}/expenses`, expenseData),
  updateExpense: (id, expenseData) => apiClient.put(`/expenses/${id}`, expenseData),
  deleteExpense: (id) => apiClient.delete(`/expenses/${id}`),
};

// Collaboration
export const collaborationApi = {
  getCollaborators: (tripId) => apiClient.get(`/trips/${tripId}/collaborators`),
  addCollaborator: (tripId, data) => apiClient.post(`/trips/${tripId}/collaborators`, data),
  removeCollaborator: (tripId, userId) => apiClient.delete(`/trips/${tripId}/collaborators/${userId}`),
};

// Checklists & Packing
export const checklistsApi = {
  getChecklists: (tripId) => apiClient.get(`/trips/${tripId}/checklists`),
  addItem: (tripId, itemData) => apiClient.post(`/trips/${tripId}/checklists`, itemData),
  toggleItem: (id) => apiClient.put(`/checklists/${id}/toggle`),
  deleteItem: (id) => apiClient.delete(`/checklists/${id}`),
};

// Notifications
export const notificationsApi = {
  getNotifications: () => apiClient.get('/notifications'),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  clearAll: () => apiClient.post('/notifications/clear'),
};

// Community
export const communityApi = {
  getPublicTrips: (params) => apiClient.get('/community/trips', { params }),
  getPublicTripByShareId: (shareId) => apiClient.get(`/community/trips/${shareId}`),
  forkTrip: (tripId) => apiClient.post(`/community/trips/${tripId}/fork`),
  likeTrip: (tripId) => apiClient.post(`/community/trips/${tripId}/like`),
};

// Weather
export const weatherApi = {
  getForecast: (city) => apiClient.get(`/weather/${city}`),
};

// AI Engine
export const aiApi = {
  generateTrip: (params) => apiClient.post('/ai/generate-trip', params),
  getRecommendations: (params) => apiClient.get('/ai/recommendations', { params }),
};

// Admin Telemetry & Analytics
export const adminApi = {
  getStats: () => apiClient.get('/admin/stats'),
};

// Travel Documents Vault
export const documentsApi = {
  getAllDocuments: () => apiClient.get('/documents'),
  getDocumentById: (id) => apiClient.get(`/documents/${id}`),
  createDocument: (docData) => apiClient.post('/documents', docData),
  updateDocument: (id, docData) => apiClient.put(`/documents/${id}`, docData),
  deleteDocument: (id) => apiClient.delete(`/documents/${id}`),
};

export default apiClient;
