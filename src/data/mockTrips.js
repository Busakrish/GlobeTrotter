export const initialTrips = [
  {
    id: 'trip-1',
    title: 'Western Coast Highlights: Mumbai to Goa',
    description: 'A vibrant 5-day escape exploring colonial architecture, bustling markets, seafood trails, and tranquil palm-fringed Goa beaches.',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-09-10',
    endDate: '2026-09-15',
    durationDays: 5,
    budget: 45000,
    travelStyle: 'Balanced', // Backpacker, Balanced, Luxury, Adventure, Solo
    interests: ['Beach', 'Foodie', 'Culture', 'Nightlife'],
    status: 'Upcoming', // Planning, Upcoming, Active, Completed
    isPublic: true,
    shareId: 'mumbai-goa-5d-2026',
    author: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'Lead Explorer',
    },
    cities: [
      {
        id: 'stop-1',
        cityId: 'city-mumbai',
        name: 'Mumbai',
        country: 'India',
        coordinates: [18.9220, 72.8347],
        nights: 2,
        arrivalDate: '2026-09-10',
        departureDate: '2026-09-12',
        transitToNext: {
          toCity: 'Goa',
          mode: 'Train / Tejas Express',
          durationMinutes: 320, // 5h 20m
          durationText: '5h 20m',
          departureTime: '13:00',
          arrivalTime: '18:20',
          cost: 1850,
        }
      },
      {
        id: 'stop-2',
        cityId: 'city-goa',
        name: 'Goa',
        country: 'India',
        coordinates: [15.2993, 74.1240],
        nights: 3,
        arrivalDate: '2026-09-12',
        departureDate: '2026-09-15',
        transitToNext: null
      }
    ],
    days: [
      {
        dayNumber: 1,
        date: '2026-09-10',
        city: 'Mumbai',
        cityName: 'Mumbai',
        activities: [
          {
            id: 'act-d1-1',
            title: 'Sunrise Walk at Marine Drive & Breakfast',
            time: '08:30',
            durationMinutes: 90,
            cost: 450,
            category: 'Food & Dining',
            location: 'Marine Drive & Kyani Cafe',
            notes: 'Try the fresh mawa cake and Irani chai.',
            completed: false,
          },
          {
            id: 'act-d1-2',
            title: 'Gateway of India & South Bombay Walk',
            time: '11:00',
            durationMinutes: 120,
            cost: 500,
            category: 'Sightseeing',
            location: 'Colaba, Mumbai',
            notes: 'Take photos with the historic archway.',
            completed: false,
          },
          {
            id: 'act-d1-3',
            title: 'Bandra Sunset & Seafood Feast',
            time: '17:30',
            durationMinutes: 150,
            cost: 1800,
            category: 'Nightlife',
            location: 'Carter Road, Bandra',
            notes: 'Reserved table at coastal seafood diner.',
            completed: false,
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-09-11',
        city: 'Mumbai',
        cityName: 'Mumbai',
        activities: [
          {
            id: 'act-d2-1',
            title: 'Elephanta Caves Ferry Tour',
            time: '09:30',
            durationMinutes: 240,
            cost: 1200,
            category: 'Culture & Heritage',
            location: 'Elephanta Island',
            notes: 'Catch morning ferry from Gateway jetty.',
            completed: false,
          },
          {
            id: 'act-d2-2',
            title: 'Chhatrapati Shivaji Maharaj Vastu Museum',
            time: '15:00',
            durationMinutes: 120,
            cost: 300,
            category: 'Sightseeing',
            location: 'Kala Ghoda Art Precinct',
            notes: 'Walk through miniature paintings gallery.',
            completed: false,
          }
        ]
      },
      {
        dayNumber: 3,
        date: '2026-09-12',
        city: 'Transit & Goa',
        cityName: 'Goa',
        activities: [
          {
            id: 'act-d3-transit',
            title: '🚆 Transit: Mumbai CST → Madgaon (Tejas Express)',
            time: '13:00',
            durationMinutes: 320,
            cost: 1850,
            category: 'Transport',
            location: 'En route Konkan Railway',
            notes: 'Scenic western ghats viaducts and waterfalls view.',
            completed: false,
          },
          {
            id: 'act-d3-1',
            title: 'Check-in to North Goa Boutique Villa',
            time: '19:00',
            durationMinutes: 60,
            cost: 0,
            category: 'Relaxation',
            location: 'Vagator Beach',
            notes: 'Collect scooter rental keys at reception.',
            completed: false,
          },
          {
            id: 'act-d3-2',
            title: 'Anjuna Beach Shack Dinner & Acoustic Music',
            time: '20:30',
            durationMinutes: 120,
            cost: 1600,
            category: 'Food & Dining',
            location: 'Curlies / Shiva Valley Beach',
            notes: 'Authentic Goan curry and coconut mocktails.',
            completed: false,
          }
        ]
      },
      {
        dayNumber: 4,
        date: '2026-09-13',
        city: 'Goa',
        cityName: 'Goa',
        activities: [
          {
            id: 'act-d4-1',
            title: 'Scuba Diving & Dolphin Expedition',
            time: '08:00',
            durationMinutes: 270,
            cost: 3500,
            category: 'Adventure',
            location: 'Grand Island, Goa',
            notes: 'GoPro video included in package.',
            completed: false,
          },
          {
            id: 'act-d4-2',
            title: 'Old Goa Portuguese Cathedrals Walk',
            time: '15:00',
            durationMinutes: 120,
            cost: 300,
            category: 'Culture & Heritage',
            location: 'Velha Goa',
            notes: 'Basilica of Bom Jesus & Se Cathedral.',
            completed: false,
          },
          {
            id: 'act-d4-3',
            title: 'Sunset at Chapora Fort',
            time: '17:45',
            durationMinutes: 75,
            cost: 0,
            category: 'Sightseeing',
            location: 'Chapora, Vagator',
            notes: 'Iconic panoramic cliff view over Ozran beach.',
            completed: false,
          }
        ]
      },
      {
        dayNumber: 5,
        date: '2026-09-14',
        city: 'Goa',
        cityName: 'Goa',
        activities: [
          {
            id: 'act-d5-1',
            title: 'Dudhsagar Waterfall Jeep Safari',
            time: '08:30',
            durationMinutes: 300,
            cost: 2200,
            category: 'Adventure',
            location: 'Mollem National Park',
            notes: 'Carry extra clothes and water shoes.',
            completed: false,
          },
          {
            id: 'act-d5-2',
            title: 'Farewell Beach Bonfire & Night Market',
            time: '19:00',
            durationMinutes: 150,
            cost: 1400,
            category: 'Nightlife',
            location: 'Arpora Night Market',
            notes: 'Souvenir shopping and live music performances.',
            completed: false,
          }
        ]
      }
    ],
    expenses: [
      { id: 'exp-1', category: 'Transport', description: 'Tejas Express Train & Local Cabs', amount: 5500, date: '2026-09-10' },
      { id: 'exp-2', category: 'Accommodation', description: '2 Nights Mumbai Hotel + 3 Nights Goa Resort', amount: 16000, date: '2026-09-10' },
      { id: 'exp-3', category: 'Activities', description: 'Scuba, Elephanta Ferry & Dudhsagar Safari', amount: 8700, date: '2026-09-11' },
      { id: 'exp-4', category: 'Food & Dining', description: 'Seafood, Irani Cafes, Beach Shacks', amount: 7200, date: '2026-09-12' },
      { id: 'exp-5', category: 'Other', description: 'Scooter Rental, Souvenirs & Misc', amount: 3100, date: '2026-09-13' },
    ],
    packingList: [
      { id: 'p-1', item: 'Government ID / Passport & Train Tickets', category: 'Documents', checked: true },
      { id: 'p-2', item: 'Sunscreen (SPF 50+) & Polarized Sunglasses', category: 'Toiletries', checked: true },
      { id: 'p-3', item: 'Breathable linen clothes & Beachwear', category: 'Clothing', checked: true },
      { id: 'p-4', item: 'Waterproof phone pouch & GoPro for Scuba', category: 'Electronics', checked: false },
      { id: 'p-5', item: 'Quick-dry microfiber towel', category: 'Clothing', checked: true },
      { id: 'p-6', item: 'Power bank & charging cables', category: 'Electronics', checked: false },
      { id: 'p-7', item: 'Light rain jacket / Windcheater', category: 'Clothing', checked: false },
      { id: 'p-8', item: 'Comfortable walking sandals & water shoes', category: 'Footwear', checked: true },
    ]
  },
  {
    id: 'trip-2',
    title: 'Royal Rajasthan: Jaipur to Udaipur',
    description: 'A 6-day royal journey through the Pink City palaces, Amber Fort, and romantic lakes of Udaipur.',
    coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-10-15',
    endDate: '2026-10-21',
    durationDays: 6,
    budget: 55000,
    travelStyle: 'Luxury Heritage',
    interests: ['Heritage', 'Palaces', 'Photography', 'Foodie'],
    status: 'Planning',
    isPublic: true,
    shareId: 'rajasthan-royal-6d',
    author: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'Lead Explorer',
    },
    cities: [
      {
        id: 'stop-r1',
        cityId: 'city-jaipur',
        name: 'Jaipur',
        country: 'India',
        coordinates: [26.9124, 75.7873],
        nights: 3,
        arrivalDate: '2026-10-15',
        departureDate: '2026-10-18',
        transitToNext: {
          toCity: 'Udaipur',
          mode: 'Luxury Private Cab / AC Express',
          durationMinutes: 360,
          durationText: '6h 00m',
          departureTime: '08:00',
          arrivalTime: '14:00',
          cost: 3200,
        }
      },
      {
        id: 'stop-r2',
        cityId: 'city-udaipur',
        name: 'Udaipur',
        country: 'India',
        coordinates: [24.5854, 73.7125],
        nights: 3,
        arrivalDate: '2026-10-18',
        departureDate: '2026-10-21',
        transitToNext: null
      }
    ],
    days: [
      {
        dayNumber: 1,
        date: '2026-10-15',
        city: 'Jaipur',
        cityName: 'Jaipur',
        activities: [
          {
            id: 'act-rj-1',
            title: 'Hawa Mahal & City Palace Royal Tour',
            time: '10:00',
            durationMinutes: 210,
            cost: 800,
            category: 'Sightseeing',
            location: 'Old City, Jaipur',
            notes: 'Audio guide included.',
            completed: false,
          },
          {
            id: 'act-rj-2',
            title: 'Chokhi Dhani Folk Dinner',
            time: '19:00',
            durationMinutes: 180,
            cost: 1200,
            category: 'Food & Dining',
            location: 'Tonk Road',
            notes: 'Live Kalbelia dance and puppet shows.',
            completed: false,
          }
        ]
      },
      {
        dayNumber: 2,
        date: '2026-10-16',
        city: 'Jaipur',
        cityName: 'Jaipur',
        activities: [
          {
            id: 'act-rj-3',
            title: 'Sunrise Hot Air Balloon over Amer Fort',
            time: '06:00',
            durationMinutes: 180,
            cost: 7500,
            category: 'Adventure',
            location: 'Amer Hills',
            notes: 'Dress warm for early morning ascent.',
            completed: false,
          },
          {
            id: 'act-rj-4',
            title: 'Nahargarh Fort Sunset Viewpoint',
            time: '17:00',
            durationMinutes: 120,
            cost: 200,
            category: 'Sightseeing',
            location: 'Aravalli Ridge',
            notes: 'Panoramic sunset view over the Pink City.',
            completed: false,
          }
        ]
      },
      {
        dayNumber: 3,
        date: '2026-10-17',
        city: 'Jaipur',
        cityName: 'Jaipur',
        activities: [
          {
            id: 'act-rj-5',
            title: 'Johari Bazaar Gem & Textile Shopping',
            time: '11:00',
            durationMinutes: 180,
            cost: 2500,
            category: 'Culture & Heritage',
            location: 'Johari Bazaar',
            notes: 'Handblock printed cotton and blue pottery.',
            completed: false,
          }
        ]
      },
      {
        dayNumber: 4,
        date: '2026-10-18',
        city: 'Udaipur',
        cityName: 'Udaipur',
        activities: [
          {
            id: 'act-rj-transit',
            title: '🚗 Scenic Drive to Udaipur via Chittorgarh',
            time: '08:00',
            durationMinutes: 360,
            cost: 3200,
            category: 'Transport',
            location: 'Highway NH48',
            notes: 'Stop for lunch at highway heritage dhaba.',
            completed: false,
          },
          {
            id: 'act-rj-6',
            title: 'Lake Pichola Sunset Boat Cruise',
            time: '17:30',
            durationMinutes: 90,
            cost: 950,
            category: 'Sightseeing',
            location: 'Rameshwar Ghat',
            notes: 'Views of Jag Mandir and Lake Palace.',
            completed: false,
          }
        ]
      },
      {
        dayNumber: 5,
        date: '2026-10-19',
        city: 'Udaipur',
        cityName: 'Udaipur',
        activities: [
          {
            id: 'act-rj-7',
            title: 'Udaipur City Palace Complex & Crystal Gallery',
            time: '10:00',
            durationMinutes: 180,
            cost: 1100,
            category: 'Sightseeing',
            location: 'City Palace',
            notes: 'Mewar royal family collection.',
            completed: false,
          },
          {
            id: 'act-rj-8',
            title: 'Rooftop Candlelight Dinner at Ambrai',
            time: '19:30',
            durationMinutes: 150,
            cost: 2800,
            category: 'Food & Dining',
            location: 'Hanuman Ghat',
            notes: 'Unobstructed view of illuminated palace.',
            completed: false,
          }
        ]
      },
      {
        dayNumber: 6,
        date: '2026-10-20',
        city: 'Udaipur',
        cityName: 'Udaipur',
        activities: [
          {
            id: 'act-rj-9',
            title: 'Saheliyon-ki-Bari & Vintage Car Museum',
            time: '10:30',
            durationMinutes: 120,
            cost: 500,
            category: 'Sightseeing',
            location: 'Saheli Marg',
            notes: 'Marble fountains and royal Rolls Royce cars.',
            completed: false,
          }
        ]
      }
    ],
    expenses: [
      { id: 'exp-r1', category: 'Transport', description: 'Private Cab Intercity & Airport Transfers', amount: 8200, date: '2026-10-15' },
      { id: 'exp-r2', category: 'Accommodation', description: 'Heritage Haveli in Jaipur + Lake View Hotel Udaipur', amount: 22500, date: '2026-10-15' },
      { id: 'exp-r3', category: 'Activities', description: 'Hot Air Balloon, Palaces & Lake Pichola Cruise', amount: 13550, date: '2026-10-16' },
      { id: 'exp-r4', category: 'Food & Dining', description: 'Ambrai, Chokhi Dhani & Local Delicacies', amount: 6800, date: '2026-10-17' },
      { id: 'exp-r5', category: 'Other', description: 'Handicrafts & Tips', amount: 2400, date: '2026-10-19' },
    ],
    packingList: [
      { id: 'pr-1', item: 'Cotton ethnic outfits for palaces & forts', category: 'Clothing', checked: true },
      { id: 'pr-2', item: 'Comfortable walking shoes with grip for fort stones', category: 'Footwear', checked: true },
      { id: 'pr-3', item: 'Wide-brim hat & sunglasses', category: 'Accessories', checked: false },
      { id: 'pr-4', item: 'DSLR / Mirrorless camera & extra memory card', category: 'Electronics', checked: true },
    ]
  },
  {
    id: 'trip-3',
    title: 'Japan Golden Route: Tokyo to Kyoto',
    description: 'Immerse yourself in ultramodern Tokyo tech and tranquil Zen shrines in Kyoto.',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    startDate: '2026-11-04',
    endDate: '2026-11-11',
    durationDays: 7,
    budget: 180000,
    travelStyle: 'Cultural Exploration',
    interests: ['Culture', 'Anime', 'Foodie', 'Futuristic'],
    status: 'Planning',
    isPublic: true,
    shareId: 'tokyo-kyoto-7d',
    author: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      role: 'Lead Explorer',
    },
    cities: [
      {
        id: 'stop-j1',
        cityId: 'city-tokyo',
        name: 'Tokyo',
        country: 'Japan',
        coordinates: [35.6762, 139.6503],
        nights: 4,
        arrivalDate: '2026-11-04',
        departureDate: '2026-11-08',
        transitToNext: {
          toCity: 'Kyoto',
          mode: 'Shinkansen Bullet Train',
          durationMinutes: 135,
          durationText: '2h 15m',
          departureTime: '10:00',
          arrivalTime: '12:15',
          cost: 8500,
        }
      }
    ],
    days: [
      {
        dayNumber: 1,
        date: '2026-11-04',
        city: 'Tokyo',
        cityName: 'Tokyo',
        activities: [
          {
            id: 'act-t-1',
            title: 'teamLab Planets Digital Art Immersion',
            time: '10:00',
            durationMinutes: 150,
            cost: 3200,
            category: 'Culture & Heritage',
            location: 'Toyosu, Tokyo',
            notes: 'Pre-booked morning time slot.',
            completed: false,
          },
          {
            id: 'act-t-2',
            title: 'Shibuya Crossing & Izakaya Crawl',
            time: '18:30',
            durationMinutes: 210,
            cost: 4500,
            category: 'Nightlife',
            location: 'Shibuya & Shinjuku',
            notes: 'Taste yakitori and craft sake.',
            completed: false,
          }
        ]
      }
    ],
    expenses: [
      { id: 'exp-j1', category: 'Transport', description: 'JR Pass & Shinkansen', amount: 28000, date: '2026-11-04' },
      { id: 'exp-j2', category: 'Accommodation', description: 'Tokyo & Kyoto Modern Ryokans', amount: 75000, date: '2026-11-04' },
      { id: 'exp-j3', category: 'Food & Dining', description: 'Sushi Omakase, Ramen & Street Food', amount: 35000, date: '2026-11-05' },
      { id: 'exp-j4', category: 'Activities', description: 'teamLab, Tea Ceremony & Temples', amount: 18000, date: '2026-11-06' },
      { id: 'exp-j5', category: 'Other', description: 'Suica Card & Pocket WiFi', amount: 6000, date: '2026-11-04' },
    ],
    packingList: [
      { id: 'pj-1', item: 'Passport & Japan Rail Exchange Order', category: 'Documents', checked: true },
      { id: 'pj-2', item: 'Universal Power Adapter (Type A/B)', category: 'Electronics', checked: true },
      { id: 'pj-3', item: 'Slip-on comfortable shoes for temple visits', category: 'Footwear', checked: false },
    ]
  }
];
