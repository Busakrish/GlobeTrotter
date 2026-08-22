export const mockAdminStats = {
  kpis: [
    { label: 'Total Registered Travelers', value: '24,850', change: '+18.4%', trend: 'up', color: 'indigo' },
    { label: 'Multi-City Trips Planned', value: '14,290', change: '+24.1%', trend: 'up', color: 'emerald' },
    { label: 'Total Budget Managed', value: '₹18.4 Cr', change: '+15.2%', trend: 'up', color: 'sky' },
    { label: 'Conflict Alerts Resolved', value: '3,840', change: '+32.0%', trend: 'up', color: 'amber' },
  ],
  userGrowthData: [
    { month: 'Jan', travelers: 8200, trips: 4100 },
    { month: 'Feb', travelers: 10400, trips: 5600 },
    { month: 'Mar', travelers: 13100, trips: 7200 },
    { month: 'Apr', travelers: 15800, trips: 9100 },
    { month: 'May', travelers: 19200, trips: 11400 },
    { month: 'Jun', travelers: 21900, trips: 12900 },
    { month: 'Jul', travelers: 24850, trips: 14290 },
  ],
  popularDestinations: [
    { name: 'Goa', tripsCount: 3820, percentage: 26, avgDays: 4.8 },
    { name: 'Jaipur & Udaipur', tripsCount: 2940, percentage: 20, avgDays: 5.4 },
    { name: 'Mumbai', tripsCount: 2450, percentage: 17, avgDays: 3.2 },
    { name: 'Tokyo & Kyoto', tripsCount: 1890, percentage: 13, avgDays: 7.1 },
    { name: 'Paris & Alps', tripsCount: 1620, percentage: 11, avgDays: 8.0 },
    { name: 'Bali', tripsCount: 1570, percentage: 13, avgDays: 6.2 },
  ],
  categorySpendingDistribution: [
    { name: 'Accommodation', value: 42, color: '#4f46e5' },
    { name: 'Transport & Flights', value: 28, color: '#06b6d4' },
    { name: 'Food & Dining', value: 16, color: '#10b981' },
    { name: 'Activities & Tours', value: 10, color: '#f59e0b' },
    { name: 'Misc & Shopping', value: 4, color: '#ec4899' },
  ],
  recentPlatformEvents: [
    { id: 'ev-1', user: 'Priya S.', action: 'Created new 5-day trip: Mumbai to Goa', time: '10 mins ago', type: 'trip_create' },
    { id: 'ev-2', user: 'Kenji T.', action: 'Forked itinerary "Royal Rajasthan: Forts & Palaces"', time: '28 mins ago', type: 'trip_fork' },
    { id: 'ev-3', user: 'Sophie L.', action: 'Resolved 1 transit schedule conflict in Paris itinerary', time: '45 mins ago', type: 'conflict_resolved' },
    { id: 'ev-4', user: 'Vikram R.', action: 'Generated AI Packing List for Leh-Ladakh', time: '1 hour ago', type: 'ai_tool' },
    { id: 'ev-5', user: 'Tanvi K.', action: 'Published trip to GlobeTrotter Community (34 likes)', time: '2 hours ago', type: 'community' },
  ]
};
