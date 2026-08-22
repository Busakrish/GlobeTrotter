export const destinationCategories = [
  { key: 'all', label: 'All Destinations', icon: 'Sparkles' },
  { key: 'popular', label: 'Popular Destinations', icon: 'TrendingUp' },
  { key: 'trending', label: 'Trending', icon: 'Zap' },
  { key: 'beach', label: 'Beaches & Coastal', icon: 'Palmtree' },
  { key: 'mountain', label: 'Mountains & Alpine', icon: 'Mountain' },
  { key: 'city', label: 'Vibrant Cities', icon: 'Building2' },
  { key: 'historical', label: 'Historical & Palaces', icon: 'Landmark' },
  { key: 'food', label: 'Food & Gastronomy', icon: 'Utensils' },
  { key: 'adventure', label: 'Adventure & Treks', icon: 'Compass' },
  { key: 'hidden', label: 'Hidden Gems', icon: 'Gem' },
];

export const mockDestinations = [
  {
    id: 'dest-mumbai',
    name: 'Mumbai',
    country: 'India',
    region: 'Maharashtra',
    category: 'city',
    secondaryCategories: ['popular', 'trending', 'food'],
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1920&q=80',
    description: 'The City of Dreams — a vibrant coastal metropolis blending Victorian Gothic architecture, historic Irani cafes, Bollywood glamour, and dynamic Arabian Sea shorelines.',
    shortDescription: 'Cosmopolitan capital with heritage monuments, street food, and Arabian Sea views.',
    costIndex: '$$',
    avgDailyCost: 4500,
    rating: 4.8,
    reviewsCount: 1420,
    coordinates: [18.9220, 72.8347],
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    tags: ['Heritage', 'Nightlife', 'Foodie', 'Coastal', 'Art'],
    travelStyle: 'Balanced',
    attractions: [
      {
        name: 'Gateway of India & Colaba',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
        description: 'Iconic 1924 basalt arch overlooking Mumbai harbour and the historic Taj Mahal Palace.',
        cost: 0,
        timeNeeded: '2 hours',
      },
      {
        name: 'Marine Drive & Queens Necklace',
        image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80',
        description: 'Picturesque 3.6-kilometer seaside promenade renowned for panoramic Arabian Sea sunsets.',
        cost: 0,
        timeNeeded: '1.5 hours',
      },
      {
        name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'UNESCO World Heritage Victorian Gothic railway headquarters with gargoyles and domes.',
        cost: 200,
        timeNeeded: '1 hour',
      }
    ],
    restaurants: [
      { name: 'Britannia & Co. Restaurant', cuisine: 'Parsi & Iranian Berry Pulao', price: '₹₹', rating: 4.7 },
      { name: 'Trishna Seafood Restaurant', cuisine: 'Butter Garlic Crab & Coastal Mangalorean', price: '₹₹₹', rating: 4.8 },
      { name: 'Bademiya Colaba', cuisine: 'Legendary Midnight Seekh Kebabs & Baida Roti', price: '₹', rating: 4.5 },
    ],
    activities: [
      'South Bombay Heritage Architecture Walk',
      'Elephanta Caves UNESCO Ferry Excursion',
      'Dharavi Artisans & Pottery Tour',
      'Bandra Street Art & Bandstand Sunset Walk'
    ],
    travelTips: [
      'Use local local AC trains or app cabs (Uber/Ola) for fast travel across South Mumbai.',
      'Evenings at Marine Drive are best enjoyed between 5:30 PM and 7:00 PM for golden hour.',
      'Carry cash for iconic street food stalls like Juhu beach pav bhaji.'
    ]
  },
  {
    id: 'dest-goa',
    name: 'Goa',
    country: 'India',
    region: 'Western Coast',
    category: 'beach',
    secondaryCategories: ['popular', 'trending', 'food', 'adventure'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=80',
    description: 'Sun-drenched golden beaches, swaying palms, Portuguese colonial villas, fragrant spice plantations, and vibrant coastal shacks serving spicy Goan fish curry.',
    shortDescription: 'Golden sands, Portuguese heritage churches, water sports, and beach shacks.',
    costIndex: '$$',
    avgDailyCost: 3800,
    rating: 4.9,
    reviewsCount: 2310,
    coordinates: [15.2993, 74.1240],
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    tags: ['Beach', 'Seafood', 'Nightlife', 'Water Sports', 'Heritage'],
    travelStyle: 'Relaxation',
    attractions: [
      {
        name: 'Fontainhas Latin Quarter',
        image: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=600&q=80',
        description: 'Vibrant narrow lanes lined with bright pastel Portuguese villas, terracotta roofs, and art cafes.',
        cost: 0,
        timeNeeded: '2 hours',
      },
      {
        name: 'Aguada Fort & Lighthouse',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
        description: '17th-century Portuguese fortress overlooking Sinquerim beach and the vast Arabian Sea.',
        cost: 100,
        timeNeeded: '1.5 hours',
      },
      {
        name: 'Basilica of Bom Jesus',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
        description: 'UNESCO World Heritage baroque church in Old Goa enshrining the relics of St. Francis Xavier.',
        cost: 0,
        timeNeeded: '1 hour',
      }
    ],
    restaurants: [
      { name: "Fisherman's Wharf", cuisine: 'Authentic Goan Crab Xacuti & Prawn Curry', price: '₹₹₹', rating: 4.8 },
      { name: 'Vinayak Family Restaurant Assagao', cuisine: 'Legendary Seafood Thali', price: '₹₹', rating: 4.9 },
      { name: 'Curlies Beach Shack Anjuna', cuisine: 'Cocktails, Wood-fired Pizza & Sunset Shacks', price: '₹₹', rating: 4.6 },
    ],
    activities: [
      'Grande Island Scuba Diving & Snorkeling',
      'Mandovi River Sunset Luxury Catamaran Cruise',
      'Sahakari Spice Plantation Guided Tour & Lunch',
      'Kayaking in Sal Backwaters'
    ],
    travelTips: [
      'Renting a scooter or self-drive car is the most convenient way to explore North and South Goa.',
      'South Goa offers serene, uncrowded beaches (Palolem, Agonda); North Goa is livelier (Anjuna, Vagator).'
    ]
  },
  {
    id: 'dest-jaipur',
    name: 'Jaipur',
    country: 'India',
    region: 'Rajasthan',
    category: 'historical',
    secondaryCategories: ['popular', 'food', 'city'],
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1920&q=80',
    description: 'The Pink City — a royal wonderland of honeycomb-facade palaces, hilltop fortresses, bustling bazaars overflowing with gemstones, and rich Rajasthani royal feasts.',
    shortDescription: 'The Pink City famous for hilltop forts, Hawa Mahal, and royal palaces.',
    costIndex: '$$',
    avgDailyCost: 3400,
    rating: 4.9,
    reviewsCount: 1890,
    coordinates: [26.9124, 75.7873],
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    tags: ['Palaces', 'Forts', 'Culture', 'Handicrafts', 'Photography'],
    travelStyle: 'Culture',
    attractions: [
      {
        name: 'Amer Fort & Sheesh Mahal',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        description: 'Majestic hilltop fortress featuring intricate mirror-work in the Hall of Mirrors and elephant ramparts.',
        cost: 500,
        timeNeeded: '3 hours',
      },
      {
        name: 'Hawa Mahal (Palace of Winds)',
        image: 'https://images.unsplash.com/photo-1603288967323-9c8ec4c2ecbb?auto=format&fit=crop&w=600&q=80',
        description: 'Five-story pink sandstone facade with 953 ornate lattice jharokhas built for royal women.',
        cost: 200,
        timeNeeded: '1 hour',
      },
      {
        name: 'City Palace & Jantar Mantar',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80',
        description: 'Living royal residence housing royal textiles, armor, and 18th-century astronomical instruments.',
        cost: 700,
        timeNeeded: '2.5 hours',
      }
    ],
    restaurants: [
      { name: '1135 AD Amer Fort', cuisine: 'Fine Dining Royal Rajasthani Thali & Lal Maas', price: '₹₹₹₹', rating: 4.9 },
      { name: 'Laxmi Mishthan Bhandar (LMB)', cuisine: 'Ghewar, Pyaaz Kachori & Rajasthani Sweets', price: '₹₹', rating: 4.7 },
      { name: 'Chokhi Dhani', cuisine: 'Cultural Village Feast with Folk Dances', price: '₹₹₹', rating: 4.8 },
    ],
    activities: [
      'Sunrise Hot Air Balloon over Amer Fort',
      'Johari Bazaar Gemstone & Block Print Shopping',
      'Nahargarh Fort Sunset Views over the Pink City',
      'Block Printing Workshop at Bagru Village'
    ],
    travelTips: [
      'Purchase the Composite Entry Ticket to save on Amer, Hawa Mahal, Jantar Mantar, and Nahargarh.',
      'Sunset at Nahargarh Fort Padao restaurant offers the best aerial view of Jaipur.'
    ]
  },
  {
    id: 'dest-udaipur',
    name: 'Udaipur',
    country: 'India',
    region: 'Rajasthan',
    category: 'historical',
    secondaryCategories: ['trending', 'hidden', 'romantic'],
    image: 'https://images.unsplash.com/photo-1598890777032-bde13fba5be3?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1598890777032-bde13fba5be3?auto=format&fit=crop&w=1920&q=80',
    description: 'The City of Lakes — Venice of the East adorned with white marble palaces reflecting in tranquil waters, ornate balconies, ghats, and romantic boat cruises.',
    shortDescription: 'Romantic city of white marble palaces reflecting across tranquil Lake Pichola.',
    costIndex: '$$$',
    avgDailyCost: 4800,
    rating: 4.9,
    reviewsCount: 1650,
    coordinates: [24.5854, 73.7125],
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    tags: ['Lakes', 'Palaces', 'Romantic', 'Luxury', 'Heritage'],
    travelStyle: 'Luxury',
    attractions: [
      {
        name: 'City Palace Complex',
        image: 'https://images.unsplash.com/photo-1598890777032-bde13fba5be3?auto=format&fit=crop&w=600&q=80',
        description: 'Sprawling palace complex built over 400 years with cupolas, silver doors, and lake panoramas.',
        cost: 400,
        timeNeeded: '3 hours',
      },
      {
        name: 'Lake Pichola & Jag Mandir',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
        description: 'Island palace retreat accessible by boat with marble elephant sculptures and gardens.',
        cost: 500,
        timeNeeded: '2 hours',
      }
    ],
    restaurants: [
      { name: 'Ambrai Restaurant', cuisine: 'Lakeside dining with lit City Palace views', price: '₹₹₹', rating: 4.9 },
      { name: 'Upre by 1559 AD', cuisine: 'Rooftop cabana dining with Lake Pichola breeze', price: '₹₹₹', rating: 4.8 },
    ],
    activities: [
      'Sunset Boat Ride on Lake Pichola',
      'Bagore Ki Haveli Evening Folk Dance Show',
      'Vintage & Classic Car Museum Visit'
    ],
    travelTips: [
      'Book your sunset boat ride at least a day in advance during peak season (Nov-Jan).',
      'Arrive early at Bagore Ki Haveli for front-row seats at the Dharohar folk dance show.'
    ]
  },
  {
    id: 'dest-paris',
    name: 'Paris',
    country: 'France',
    region: 'Île-de-France',
    category: 'popular',
    secondaryCategories: ['city', 'food', 'historical'],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80',
    description: 'The City of Light — celebrated worldwide for iconic landmarks, haute couture, world-renowned gastronomy, timeless Louvre masterpieces, and Seine river walks.',
    shortDescription: 'Iconic art, Parisian cafes, Eiffel Tower views, and Seine river cruises.',
    costIndex: '$$$$',
    avgDailyCost: 16500,
    rating: 4.9,
    reviewsCount: 3100,
    coordinates: [48.8566, 2.3522],
    bestMonths: ['Apr', 'May', 'Jun', 'Sep', 'Oct'],
    tags: ['Art', 'Museums', 'Romantic', 'Gastronomy', 'Fashion'],
    travelStyle: 'Luxury',
    attractions: [
      {
        name: 'Eiffel Tower & Champ de Mars',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
        description: 'World-famous wrought-iron tower offering sweeping views of Paris.',
        cost: 2500,
        timeNeeded: '2.5 hours',
      },
      {
        name: 'Louvre Museum',
        image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=600&q=80',
        description: 'World largest art museum housing the Mona Lisa and Venus de Milo.',
        cost: 1800,
        timeNeeded: '4 hours',
      }
    ],
    restaurants: [
      { name: 'Le Comptoir du Relais', cuisine: 'Bistro classics & Duck Confit', price: '₹₹₹', rating: 4.8 },
      { name: 'Carefte Trocadéro', cuisine: 'Famous rich hot chocolate & pastries', price: '₹₹', rating: 4.7 }
    ],
    activities: [
      'Seine River Sunset Dinner Cruise',
      'Montmartre Bohemian & Sacré-Cœur Walk',
      'Versailles Palace Hall of Mirrors Tour'
    ],
    travelTips: [
      'Book Louvre and Eiffel Tower time-slot tickets weeks in advance.',
      'Use the Paris Metro with a Navigo Easy pass for seamless travel.'
    ]
  },
  {
    id: 'dest-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Kanto',
    category: 'trending',
    secondaryCategories: ['popular', 'city', 'food'],
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80',
    description: 'A dazzling convergence of futuristic skyscrapers, neon anime alleys, Michelin ramen counters, tranquil Shinto shrines, and ultra-efficient bullet trains.',
    shortDescription: 'Futuristic neon lights, historic Shinto shrines, ramen bars, and digital art.',
    costIndex: '$$$$',
    avgDailyCost: 14000,
    rating: 4.9,
    reviewsCount: 2840,
    coordinates: [35.6762, 139.6503],
    bestMonths: ['Mar', 'Apr', 'May', 'Oct', 'Nov'],
    tags: ['Cyberpunk', 'Ramen', 'Anime', 'Shrines', 'High-Tech'],
    travelStyle: 'Modern',
    attractions: [
      {
        name: 'teamLab Planets Digital Art Museum',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
        description: 'Immersive body-interactive digital art exhibits with infinite mirror rooms.',
        cost: 2600,
        timeNeeded: '2.5 hours',
      },
      {
        name: 'Shibuya Crossing & Sky Deck',
        image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
        description: 'World busiest pedestrian crossing viewed from the open-air Shibuya Sky observatory.',
        cost: 1600,
        timeNeeded: '1.5 hours',
      }
    ],
    restaurants: [
      { name: 'Ichiran Shibuya', cuisine: 'Customizable Tonkotsu Ramen Booths', price: '₹₹', rating: 4.9 },
      { name: 'Sushi Dai Toyosu', cuisine: 'Fresh Tuna Nigiri Omakase', price: '₹₹₹', rating: 4.8 }
    ],
    activities: [
      'Akihabara Electronics & Retro Gaming Tour',
      'Tsukiji Outer Market Morning Street Food Walk',
      'Asakusa Senso-ji Temple & Kimono Rental'
    ],
    travelTips: [
      'Get a Suica/Pasmo IC card or add it to Apple/Google Wallet for train fare payments.',
      'Convenience stores (7-Eleven, Lawson) have incredible fresh snacks, onigiri, and ATMs.'
    ]
  },
  {
    id: 'dest-bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Lesser Sunda',
    category: 'beach',
    secondaryCategories: ['popular', 'adventure', 'hidden'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80',
    description: 'The Island of the Gods — emerald jungle ravines in Ubud, terraced rice paddies, cliffside sunset temples in Uluwatu, and vibrant surf breaks in Canggu.',
    shortDescription: 'Tropical waterfalls, Uluwatu cliff temples, emerald rice terraces, and surf breaks.',
    costIndex: '$$',
    avgDailyCost: 4200,
    rating: 4.9,
    reviewsCount: 2600,
    coordinates: [-8.4095, 115.1889],
    bestMonths: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    tags: ['Tropical', 'Yoga', 'Surfing', 'Waterfalls', 'Culture'],
    travelStyle: 'Relaxation',
    attractions: [
      {
        name: 'Tegallalang Rice Terraces',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
        description: 'Iconic stepped green rice fields in Ubud featuring jungle swings.',
        cost: 300,
        timeNeeded: '2 hours',
      },
      {
        name: 'Uluwatu Temple & Kecak Dance',
        image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80',
        description: 'Dramatic sea cliff temple with fire dance performance at sunset.',
        cost: 600,
        timeNeeded: '2 hours',
      }
    ],
    restaurants: [
      { name: 'Naughty Nuri’s Ubud', cuisine: 'Famous Balinese BBQ Ribs', price: '₹₹', rating: 4.8 },
      { name: 'La Brisa Canggu', cuisine: 'Eco-chic beachfront seafood & cocktails', price: '₹₹₹', rating: 4.9 }
    ],
    activities: [
      'Mount Batur Sunrise Volcano Hike',
      'Nusa Penida Kelingking T-Rex Beach Day Trip',
      'Traditional Balinese Cooking Class in Organic Farm'
    ],
    travelTips: [
      'Hire a private driver for full-day sightseeing between Ubud and the southern beaches.',
      'Dress respectfully with sarongs (provided at entry) when visiting temples.'
    ]
  },
  {
    id: 'dest-leh',
    name: 'Leh Ladakh',
    country: 'India',
    region: 'Ladakh',
    category: 'mountain',
    secondaryCategories: ['adventure', 'hidden'],
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1920&q=80',
    description: 'High-altitude Himalayan desert surrounded by snow-capped peaks, azure Pangong Lake, dramatic mountain passes, and ancient Tibetan Buddhist monasteries.',
    shortDescription: 'High-altitude desert, turquoise Pangong Lake, and Buddhist monasteries.',
    costIndex: '$$$',
    avgDailyCost: 4500,
    rating: 4.9,
    reviewsCount: 1120,
    coordinates: [34.1526, 77.5771],
    bestMonths: ['Jun', 'Jul', 'Aug', 'Sep'],
    tags: ['Himalayas', 'Adventure', 'Motorcycle', 'Lakes', 'Spiritual'],
    travelStyle: 'Adventure',
    attractions: [
      {
        name: 'Pangong Tso Lake',
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80',
        description: 'High altitude endorheic lake famous for changing shades of blue.',
        cost: 0,
        timeNeeded: 'Full Day',
      },
      {
        name: 'Thiksey Monastery',
        image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=600&q=80',
        description: 'Twelve-story monastery complex resembling the Potala Palace of Lhasa.',
        cost: 50,
        timeNeeded: '2 hours',
      }
    ],
    restaurants: [
      { name: 'The Tibetan Kitchen Leh', cuisine: 'Hot Thukpa, Tingmo & Steamed Momos', price: '₹₹', rating: 4.9 },
      { name: 'Bon Appetit', cuisine: 'Organic garden dining with Stok Kangri mountain views', price: '₹₹₹', rating: 4.8 }
    ],
    activities: [
      'Nubra Valley Double-Humped Camel Safari at Hunder',
      'Khardung La Pass (17,982 ft) Mountain Crossing',
      'Magnetic Hill & Sangam Confluence'
    ],
    travelTips: [
      'Take at least 48 hours to rest and acclimatize in Leh city to prevent altitude sickness (AMS).',
      'Inner Line Permits (ILP) are mandatory for Pangong Lake and Nubra Valley.'
    ]
  },
  {
    id: 'dest-varanasi',
    name: 'Varanasi',
    country: 'India',
    region: 'Uttar Pradesh',
    category: 'historical',
    secondaryCategories: ['hidden', 'food'],
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1920&q=80',
    description: 'One of the oldest continuously inhabited cities on earth — sacred Ganga ghats, devotional evening Aarti ceremonies with blazing brass lamps, and rich street food culture.',
    shortDescription: 'Spiritual heart of India with mystical Ganga ghats and evening Aarti ceremonies.',
    costIndex: '$',
    avgDailyCost: 2200,
    rating: 4.8,
    reviewsCount: 1530,
    coordinates: [25.3176, 82.9739],
    bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    tags: ['Spiritual', 'Heritage', 'Ghats', 'Street Food', 'Culture'],
    travelStyle: 'Culture',
    attractions: [
      {
        name: 'Dashashwamedh Ghat & Evening Aarti',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
        description: 'Main ghat hosting the mesmerizing synchronized multi-priest Ganga Aarti.',
        cost: 0,
        timeNeeded: '2 hours',
      }
    ],
    restaurants: [
      { name: 'Kashi Chaat Bhandar', cuisine: 'Tamatar Chaat & Dahi Puri', price: '₹', rating: 4.9 },
      { name: 'Blue Lassi Shop', cuisine: 'Creamy clay-pot Lassi topped with fruits & rabri', price: '₹', rating: 4.8 }
    ],
    activities: [
      'Sunrise Boat Ride along the 84 Ghats',
      'Sarnath Buddhist Stupa & Museum Excursion',
      'Banarasi Silk Weaving Workshop Walk'
    ],
    travelTips: [
      'The morning boat ride between Assi and Manikarnika ghats is best taken right at sunrise (5:30 AM).',
      'Explore the ancient narrow alleys (galis) on foot to uncover hidden temples.'
    ]
  },
  {
    id: 'dest-dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    category: 'popular',
    secondaryCategories: ['city', 'adventure', 'trending'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80',
    description: 'An architectural oasis of record-breaking skyscrapers, luxury desert glamping, artificial palm archipelagos, indoor ski slopes, and world-class luxury shopping.',
    shortDescription: 'Burj Khalifa, futuristic architecture, desert dune bashing, and luxury malls.',
    costIndex: '$$$$',
    avgDailyCost: 15500,
    rating: 4.9,
    reviewsCount: 2200,
    coordinates: [25.2048, 55.2708],
    bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    tags: ['Luxury', 'Skyscrapers', 'Desert', 'Shopping', 'Theme Parks'],
    travelStyle: 'Luxury',
    attractions: [
      {
        name: 'Burj Khalifa & Dubai Mall',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
        description: 'Tallest building in the world with observation deck on the 148th floor.',
        cost: 4200,
        timeNeeded: '3 hours',
      }
    ],
    restaurants: [
      { name: 'Al Fanar Restaurant', cuisine: 'Traditional Emirati Machboos & Seafood', price: '₹₹₹', rating: 4.7 }
    ],
    activities: [
      'Desert Safari Dune Bashing with BBQ Dinner & Stargazing',
      'Dubai Marina Luxury Yacht Cruise',
      'Museum of the Future Interactive Experience'
    ],
    travelTips: [
      'The Dubai Metro is fully automated and connects DXB airport directly to Downtown and Marina.'
    ]
  }
];

export function getDestinationById(id) {
  return mockDestinations.find((d) => d.id === id || d.name.toLowerCase() === id?.toLowerCase());
}
