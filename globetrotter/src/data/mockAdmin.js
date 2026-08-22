export const mockAdminStats = {
  kpis: [
    { label: 'Total Registered Travelers', value: '2', change: '+100%', trend: 'up', color: 'indigo' },
    { label: 'Multi-City Trips Planned', value: '3', change: '+100%', trend: 'up', color: 'emerald' },
    { label: 'Total Budget Managed', value: '₹2.8 Lakh', change: '+100%', trend: 'up', color: 'sky' },
    { label: 'Conflict Alerts Monitored', value: '0 active', change: 'Optimal', trend: 'up', color: 'amber' },
  ],
  userGrowthData: [
    { month: 'Q1', travelers: 1, trips: 1 },
    { month: 'Q2', travelers: 1, trips: 2 },
    { month: 'Current', travelers: 2, trips: 3 },
  ],
  popularDestinations: [
    { name: 'Goa', tripsCount: 1, percentage: 33, avgDays: 5.0 },
    { name: 'Jaipur & Udaipur', tripsCount: 1, percentage: 33, avgDays: 6.0 },
    { name: 'Tokyo & Kyoto', tripsCount: 1, percentage: 33, avgDays: 8.0 },
  ],
  categorySpendingDistribution: [
    { name: 'Accommodation', value: 40, color: '#4f46e5' },
    { name: 'Transport & Flights', value: 28, color: '#06b6d4' },
    { name: 'Food & Dining', value: 18, color: '#10b981' },
    { name: 'Activities & Tours', value: 10, color: '#f59e0b' },
    { name: 'Misc & Shopping', value: 4, color: '#ec4899' },
  ],
  recentPlatformEvents: [
    { id: 'ev-1', user: 'Priya Sharma', action: 'Created new 5-day itinerary: Mumbai to Goa', time: '10 mins ago', type: 'trip_create' },
    { id: 'ev-2', user: 'Alex Rivera (Admin)', action: 'Logged in to Admin Telemetry Dashboard', time: '25 mins ago', type: 'admin_login' },
    { id: 'ev-3', user: 'Priya Sharma', action: 'Synchronized multi-city budget and activities for Tokyo', time: '1 hour ago', type: 'trip_edit' },
  ]
};
