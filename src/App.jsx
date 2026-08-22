import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { TripProvider } from './context/TripContext';
import { GroupJournalProvider } from './context/GroupJournalContext';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import Toast from './components/common/Toast';

// Public Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import DestinationDetails from './pages/DestinationDetails';
import About from './pages/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import PublicTrip from './pages/PublicTrip';

// Authenticated Pages
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import EditTrip from './pages/EditTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import DayDetails from './pages/DayDetails';
import CalendarPage from './pages/CalendarPage';
import Budget from './pages/Budget';
import TravelChecklist from './pages/TravelChecklist';
import PackingList from './pages/PackingList';
import SavedPlaces from './pages/SavedPlaces';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import Recommendations from './pages/Recommendations';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboard from './pages/AdminDashboard';
import DocumentVault from './pages/DocumentVault';
import GroupJournals from './pages/GroupJournals';
import GroupJournalDetail from './pages/GroupJournalDetail';

export function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <TripProvider>
          <GroupJournalProvider>
            <BrowserRouter>
              <Toast />
              <Routes>
                {/* 1. Public Standalone Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Public Shareable Read-Only Itinerary */}
                <Route
                  path="/trip/:shareId"
                  element={
                    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 max-w-6xl mx-auto">
                      <PublicTrip />
                    </div>
                  }
                />

                {/* 2. Main Application Workspace (Under DashboardLayout) */}
                <Route element={<DashboardLayout />}>
                  {/* Core Navigation */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/explore/:destinationId" element={<DestinationDetails />} />
                  <Route path="/saved" element={<SavedPlaces />} />
                  <Route path="/notifications" element={<NotificationsPage />} />

                  {/* Document Storage Vault */}
                  <Route path="/documents" element={<DocumentVault />} />
                  <Route path="/trips/:tripId/documents" element={<DocumentVault />} />

                  {/* Group Trip Journals */}
                  <Route path="/groups" element={<GroupJournals />} />
                  <Route path="/groups/:groupId" element={<GroupJournalDetail />} />

                  {/* Trip Library & Creation */}
                  <Route path="/trips" element={<MyTrips />} />
                  <Route path="/trips/create" element={<CreateTrip />} />

                  {/* Trip Details & Sub-Workspaces */}
                  <Route path="/trips/:tripId" element={<TripDetails />} />
                  <Route path="/trips/:tripId/edit" element={<EditTrip />} />
                  <Route path="/trips/:tripId/itinerary" element={<ItineraryBuilder />} />
                  <Route path="/trips/:tripId/day/:dayId" element={<DayDetails />} />
                  <Route path="/trips/:tripId/calendar" element={<CalendarPage />} />
                  <Route path="/trips/:tripId/budget" element={<Budget />} />
                  <Route path="/trips/:tripId/checklist" element={<TravelChecklist />} />
                  <Route path="/trips/:tripId/packing" element={<PackingList />} />

                  {/* Global Search & Assistant Tools */}
                  <Route path="/search/cities" element={<CitySearch />} />
                  <Route path="/search/activities" element={<ActivitySearch />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/packing-list" element={<PackingList />} />
                  <Route path="/community" element={<Community />} />

                  {/* Profile, Settings & Admin */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </GroupJournalProvider>
        </TripProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
