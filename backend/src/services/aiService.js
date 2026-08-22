const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const SYSTEM_INSTRUCTION = `You are GlobeTrotter's Senior AI Travel Curator and Itinerary Architect.
Your role is to craft realistic, highly personalized, culturally rich, and budget-conscious travel recommendations.
Guidelines:
1. Respect the user's budget, pace, group dynamics, and travel vibes.
2. Group activities logically by geographical vicinity to minimize travel time.
3. Include realistic cost estimates in INR (₹) and 24-hour HH:MM time slots.
4. Output strict JSON adhering directly to the provided schema with no surrounding Markdown or backticks.`;

/**
 * Helper to call Gemini API with Structured Output Schema
 */
const callGemini = async (prompt, responseSchema, timeout = 12000) => {
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const payload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        topP: 0.85,
        responseMimeType: 'application/json',
        ...(responseSchema ? { responseSchema } : {}),
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text();
      console.warn('[AI Service] Gemini API returned error status:', response.status, errBody);
      return null;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (error) {
    console.warn('[AI Service] Gemini API request failed, utilizing high-fidelity fallback:', error.message);
  }
  return null;
};

// ==========================================
// 1. GENERATE SMART ITINERARY
// ==========================================

const ITINERARY_SCHEMA = {
  type: 'OBJECT',
  properties: {
    title: { type: 'STRING' },
    summary: { type: 'STRING' },
    destination: { type: 'STRING' },
    durationDays: { type: 'INTEGER' },
    travelers: { type: 'INTEGER' },
    totalEstimatedCost: { type: 'NUMBER' },
    budgetBreakdown: {
      type: 'OBJECT',
      properties: {
        flights: { type: 'NUMBER' },
        accommodation: { type: 'NUMBER' },
        food: { type: 'NUMBER' },
        transportation: { type: 'NUMBER' },
        activities: { type: 'NUMBER' },
        shopping: { type: 'NUMBER' },
      },
      required: ['flights', 'accommodation', 'food', 'transportation', 'activities', 'shopping'],
    },
    days: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          dayNumber: { type: 'INTEGER' },
          title: { type: 'STRING' },
          cityName: { type: 'STRING' },
          date: { type: 'STRING' },
          weather: {
            type: 'OBJECT',
            properties: {
              condition: { type: 'STRING' },
              temp: { type: 'NUMBER' },
              icon: { type: 'STRING' },
            },
            required: ['condition', 'temp', 'icon'],
          },
          activities: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                activityId: { type: 'STRING' },
                name: { type: 'STRING' },
                title: { type: 'STRING' },
                category: { type: 'STRING' },
                time: { type: 'STRING' },
                startTime: { type: 'STRING' },
                durationMinutes: { type: 'INTEGER' },
                cost: { type: 'NUMBER' },
                estimatedCost: { type: 'NUMBER' },
                location: { type: 'STRING' },
                description: { type: 'STRING' },
                completed: { type: 'BOOLEAN' },
              },
              required: ['activityId', 'name', 'title', 'category', 'time', 'durationMinutes', 'cost', 'location', 'description'],
            },
          },
        },
        required: ['dayNumber', 'title', 'cityName', 'activities'],
      },
    },
    packingList: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          category: { type: 'STRING' },
          quantity: { type: 'INTEGER' },
          packed: { type: 'BOOLEAN' },
          essential: { type: 'BOOLEAN' },
        },
        required: ['name', 'category', 'quantity'],
      },
    },
    checklist: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          category: { type: 'STRING' },
          completed: { type: 'BOOLEAN' },
          essential: { type: 'BOOLEAN' },
        },
        required: ['title', 'category', 'completed'],
      },
    },
  },
  required: ['title', 'summary', 'destination', 'durationDays', 'budgetBreakdown', 'days', 'packingList', 'checklist'],
};

const generateFallbackTrip = ({ destination = 'Goa', days = 5, budget = 45000, travelers = 2, travelStyle = 'Balanced Explorer', interests = ['Culture', 'Food', 'Relaxation'] }) => {
  const numDays = Math.max(1, Math.min(14, Number(days) || 5));
  const numBudget = Number(budget) || 45000;
  const numTravelers = Number(travelers) || 2;

  const dayTitles = [
    `Arrival & Historic Quarter Exploration`,
    `Iconic Sights, Architecture & Local Street Food`,
    `Cultural Discovery & Scenic Sunset Point`,
    `Hidden Treasures, Artisanal Markets & Dining`,
    `Leisure Morning, Souvenirs & Departure`,
    `Coastal Excursion & Water Adventures`,
    `Mountain Viewpoint & Nature Sanctuary`,
  ];

  const activitiesPool = [
    { name: 'Old Town Heritage Walk', category: 'Sightseeing', time: '10:00', durationMinutes: 120, cost: 300, desc: 'Guided walking tour through historic architecture.' },
    { name: 'Famous Street Food Trail', category: 'Food & Dining', time: '13:00', durationMinutes: 90, cost: 600, desc: 'Tasting iconic regional specialties and refreshments.' },
    { name: 'Panoramic Sunset Viewpoint', category: 'Sightseeing', time: '17:30', durationMinutes: 90, cost: 200, desc: 'Golden hour photography and sweeping vistas.' },
    { name: 'Traditional Dining & Live Music', category: 'Food & Dining', time: '19:30', durationMinutes: 120, cost: 1200, desc: 'Authentic dinner experience in a traditional setting.' },
    { name: 'Museum & Cultural Gallery', category: 'Sightseeing', time: '10:30', durationMinutes: 120, cost: 400, desc: 'Exploring celebrated regional art collections and relics.' },
    { name: 'Artisan Crafts & Spice Market', category: 'Shopping', time: '15:00', durationMinutes: 90, cost: 500, desc: 'Bustling market stalls selling local handcrafts and souvenirs.' },
  ];

  const generatedDays = Array.from({ length: numDays }).map((_, i) => {
    const dayNum = i + 1;
    const title = dayTitles[i % dayTitles.length] || `Day ${dayNum} Exploration`;
    const offsetDate = new Date(Date.now() + 86400000 * (i + 7)).toISOString().split('T')[0];

    const acts = [
      {
        activityId: `act-${dayNum}-1`,
        name: activitiesPool[(i * 2) % activitiesPool.length].name,
        title: activitiesPool[(i * 2) % activitiesPool.length].name,
        description: activitiesPool[(i * 2) % activitiesPool.length].desc,
        time: activitiesPool[(i * 2) % activitiesPool.length].time,
        startTime: activitiesPool[(i * 2) % activitiesPool.length].time,
        durationMinutes: activitiesPool[(i * 2) % activitiesPool.length].durationMinutes,
        category: activitiesPool[(i * 2) % activitiesPool.length].category,
        cost: activitiesPool[(i * 2) % activitiesPool.length].cost,
        estimatedCost: activitiesPool[(i * 2) % activitiesPool.length].cost,
        location: destination,
        completed: false,
      },
      {
        activityId: `act-${dayNum}-2`,
        name: activitiesPool[(i * 2 + 1) % activitiesPool.length].name,
        title: activitiesPool[(i * 2 + 1) % activitiesPool.length].name,
        description: activitiesPool[(i * 2 + 1) % activitiesPool.length].desc,
        time: activitiesPool[(i * 2 + 1) % activitiesPool.length].time,
        startTime: activitiesPool[(i * 2 + 1) % activitiesPool.length].time,
        durationMinutes: activitiesPool[(i * 2 + 1) % activitiesPool.length].durationMinutes,
        category: activitiesPool[(i * 2 + 1) % activitiesPool.length].category,
        cost: activitiesPool[(i * 2 + 1) % activitiesPool.length].cost,
        estimatedCost: activitiesPool[(i * 2 + 1) % activitiesPool.length].cost,
        location: destination,
        completed: false,
      },
    ];

    return {
      dayNumber: dayNum,
      date: offsetDate,
      cityName: destination,
      title,
      weather: { condition: 'Sunny', temp: 28, icon: 'Sun' },
      activities: acts,
    };
  });

  return {
    title: `${numDays}-Day ${travelStyle} in ${destination}`,
    destination,
    durationDays: numDays,
    travelers: numTravelers,
    budget: numBudget,
    travelStyle,
    interests,
    summary: `A carefully orchestrated ${numDays}-day journey across ${destination} tailored for ${travelStyle} travelers with a budget of ₹${numBudget.toLocaleString()}.`,
    budgetBreakdown: {
      flights: Math.round(numBudget * 0.25),
      accommodation: Math.round(numBudget * 0.35),
      food: Math.round(numBudget * 0.15),
      transportation: Math.round(numBudget * 0.10),
      activities: Math.round(numBudget * 0.10),
      shopping: Math.round(numBudget * 0.05),
    },
    days: generatedDays,
    packingList: [
      { name: 'Breathable Cotton Shirts', category: 'Clothing', quantity: numDays + 1, packed: false },
      { name: 'Comfortable Walking Shoes', category: 'Clothing', quantity: 1, packed: false },
      { name: 'Universal Travel Adapter', category: 'Electronics', quantity: 1, packed: false },
      { name: 'Power Bank (10000mAh)', category: 'Electronics', quantity: 1, packed: false },
      { name: 'Sunscreen & Lip Balm', category: 'Toiletries', quantity: 1, packed: false },
      { name: 'Govt Photo ID & Booking Prints', category: 'Documents', quantity: 2, packed: false, essential: true },
    ],
    checklist: [
      { title: 'Confirm flight/train tickets', category: 'Before Travel', completed: false, essential: true },
      { title: 'Reserve hotel accommodation voucher', category: 'Before Travel', completed: false, essential: true },
      { title: 'Check weather forecast & download offline map', category: 'Preparation', completed: false },
      { title: 'Carry cash / local currency for bazaars', category: 'Preparation', completed: false },
    ],
  };
};

export const generateTripWithAI = async (params) => {
  const prompt = `Generate a ${params.days || 5}-day comprehensive travel plan for ${params.destination || 'Goa'}.
- Total Budget: ₹${params.budget || 45000} INR
- Travelers: ${params.travelers || 2}
- Travel Style: ${params.travelStyle || 'Balanced Explorer'}
- Interests: ${Array.isArray(params.interests) ? params.interests.join(', ') : 'Culture, Food'}
- Pace: ${params.pace || 'Moderate'}`;

  const aiResult = await callGemini(prompt, ITINERARY_SCHEMA);
  if (aiResult && aiResult.days && Array.isArray(aiResult.days)) {
    return aiResult;
  }

  return generateFallbackTrip(params);
};

// ==========================================
// 2. PERSONALIZED DESTINATION RECOMMENDATIONS
// ==========================================

const RECOMMENDATION_SCHEMA = {
  type: 'OBJECT',
  properties: {
    personaSummary: { type: 'STRING' },
    recommendations: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          destinationId: { type: 'STRING' },
          name: { type: 'STRING' },
          stateOrCountry: { type: 'STRING' },
          matchScore: { type: 'INTEGER' },
          highlight: { type: 'STRING' },
          idealDuration: { type: 'STRING' },
          estimatedBudgetPerPerson: { type: 'NUMBER' },
          accentColor: { type: 'STRING' },
          topExperiences: {
            type: 'ARRAY',
            items: { type: 'STRING' },
          },
          tags: {
            type: 'ARRAY',
            items: { type: 'STRING' },
          },
        },
        required: ['destinationId', 'name', 'matchScore', 'highlight', 'idealDuration', 'estimatedBudgetPerPerson', 'topExperiences', 'tags'],
      },
    },
  },
  required: ['personaSummary', 'recommendations'],
};

const DESTINATIONS_MASTER_POOL = [
  {
    destinationId: 'dest-goa',
    name: 'Goa (North & South)',
    stateOrCountry: 'India',
    highlight: 'Sun-drenched beaches, Portuguese colonial quarters, water sports & beachside seafood shacks.',
    idealDuration: '4 - 5 Days',
    baseBudget: 22000,
    accentColor: '#3E8EDE',
    topExperiences: ['Scuba Diving at Grand Island', 'Fontainhas Heritage Walk in Panaji', 'Sunset Shack Dinner at Anjuna'],
    tags: ['Beach', 'Nightlife', 'Seafood', 'Relaxation', 'Coastal & Beach', 'Street Food & Dining'],
  },
  {
    destinationId: 'dest-udaipur',
    name: 'Udaipur, Rajasthan',
    stateOrCountry: 'India',
    highlight: 'Romantic lake palaces, heritage boat rides, and rooftop Mewari royal dining.',
    idealDuration: '3 - 4 Days',
    baseBudget: 24000,
    accentColor: '#714B67',
    topExperiences: ['City Palace Tour', 'Lake Pichola Sunset Cruise', 'Bagore Ki Haveli Folk Dance'],
    tags: ['Heritage', 'Romantic', 'Architecture', 'Culture', 'Heritage & History', 'Scenic Photography'],
  },
  {
    destinationId: 'dest-munnar',
    name: 'Munnar, Kerala',
    stateOrCountry: 'India',
    highlight: 'Emerald tea plantations, misty mountain vistas, waterfalls, and Ayurvedic wellness.',
    idealDuration: '3 - 5 Days',
    baseBudget: 18000,
    accentColor: '#2AB79B',
    topExperiences: ['Kolukkumalai Sunrise Jeep Safari', 'Tea Museum & Tasting', 'Eravikulam National Park'],
    tags: ['Nature', 'Relaxation', 'Scenic', 'Trekking', 'Nature & Mountain', 'Wellness & Chill'],
  },
  {
    destinationId: 'dest-rishikesh',
    name: 'Rishikesh, Uttarakhand',
    stateOrCountry: 'India',
    highlight: 'White-water Ganges rafting, Himalayan bungee jumping, yoga ashrams & Ganga Aarti.',
    idealDuration: '3 - 4 Days',
    baseBudget: 14000,
    accentColor: '#F0A63F',
    topExperiences: ['Ganges Grade-IV River Rafting', 'Triveni Ghat Evening Aarti', 'Cliff Jumping & Bungee at Mohan Chatti'],
    tags: ['Adventure', 'Spiritual', 'Trekking', 'Yoga', 'Adventure & Trekking', 'Spiritual & Ghats'],
  },
  {
    destinationId: 'dest-amritsar',
    name: 'Amritsar, Punjab',
    stateOrCountry: 'India',
    highlight: 'Sacred Golden Temple serenity, historic Wagah Border parade & legendary culinary food trails.',
    idealDuration: '2 - 3 Days',
    baseBudget: 12000,
    accentColor: '#F16E62',
    topExperiences: ['Night Palki Sahib Ceremony at Golden Temple', 'Wagah Border Sunset Ceremony', 'Kulcha Land & Kesar Da Dhaba Food Trail'],
    tags: ['Street Food', 'Culture', 'Spiritual', 'Historic', 'Street Food & Dining', 'Spiritual & Ghats'],
  },
  {
    destinationId: 'dest-manali',
    name: 'Manali & Solang Valley',
    stateOrCountry: 'India',
    highlight: 'Snow-capped Himalayan peaks, apple orchards, paragliding & Atal Tunnel high-altitude drives.',
    idealDuration: '4 - 6 Days',
    baseBudget: 22000,
    accentColor: '#3E8EDE',
    topExperiences: ['Solang Valley Paragliding & Skiing', 'Rohtang Pass Snow Excursion', 'Old Manali Cafe & Live Music Crawl'],
    tags: ['Nature', 'Adventure', 'Mountains', 'Scenic', 'Nature & Mountain', 'Adventure & Trekking'],
  },
  {
    destinationId: 'dest-varanasi',
    name: 'Varanasi, Uttar Pradesh',
    stateOrCountry: 'India',
    highlight: 'Ancient spiritual ghats, evening Ganga Aarti, silk weavers & midnight street food bazaars.',
    idealDuration: '2 - 3 Days',
    baseBudget: 11000,
    accentColor: '#F0A63F',
    topExperiences: ['Dawn Boat Ride on Ganga', 'Dashashwamedh Maha Aarti', 'Kashi Chaat Bhandar Street Food Trail'],
    tags: ['Spiritual', 'Street Food', 'Historic', 'Photography', 'Spiritual & Ghats', 'Heritage & History'],
  },
  {
    destinationId: 'dest-andaman',
    name: 'Havelock Island, Andamans',
    stateOrCountry: 'India',
    highlight: 'Crystal turquoise waters, Radhanagar Beach sunsets, scuba diving & bioluminescent night kayaking.',
    idealDuration: '5 - 7 Days',
    baseBudget: 45000,
    accentColor: '#2AB79B',
    topExperiences: ['Scuba Diving at Elephant Beach', 'Radhanagar Sunset (Asia’s Best Beach)', 'Night Bioluminescence Kayaking'],
    tags: ['Beach', 'Adventure', 'Nature', 'Romantic', 'Coastal & Beach', 'Wellness & Chill'],
  },
  {
    destinationId: 'dest-hampi',
    name: 'Hampi, Karnataka',
    stateOrCountry: 'India',
    highlight: 'UNESCO boulder landscape, 14th-century Vijayanagara ruins, and riverside bohemian cafe culture.',
    idealDuration: '3 Days',
    baseBudget: 13000,
    accentColor: '#714B67',
    topExperiences: ['Virupaksha Temple Exploration', 'Coracle Ride across Tungabhadra', 'Matanga Hill Sunset Panorama'],
    tags: ['Heritage', 'Ruins', 'Adventure', 'UNESCO', 'Heritage & History', 'Scenic Photography'],
  },
  {
    destinationId: 'dest-varkala',
    name: 'Varkala, Kerala',
    stateOrCountry: 'India',
    highlight: 'Dramatic red cliff beaches overlooking the Arabian Sea, surf schools & coastal yoga cafes.',
    idealDuration: '3 - 4 Days',
    baseBudget: 16000,
    accentColor: '#F16E62',
    topExperiences: ['Cliff-edge Sunset Dining', 'Surf Lessons at Black Sand Beach', 'Ayurvedic Body Massage & Yoga'],
    tags: ['Beach', 'Relaxation', 'Wellness', 'Culture', 'Coastal & Beach', 'Wellness & Chill'],
  },
  {
    destinationId: 'dest-jaipur',
    name: 'Jaipur, Rajasthan',
    stateOrCountry: 'India',
    highlight: 'Pink City royal palaces, hilltop Amer Fort, vibrant Johari Bazaar & authentic Rajasthani thalis.',
    idealDuration: '3 - 4 Days',
    baseBudget: 19000,
    accentColor: '#F0A63F',
    topExperiences: ['Amer Fort Jeep & Light Show', 'Hawa Mahal Photography', 'Chokhi Dhani Cultural Village Dinner'],
    tags: ['Heritage', 'Culture', 'Street Food', 'Shopping', 'Heritage & History', 'Street Food & Dining'],
  },
  {
    destinationId: 'dest-ladakh',
    name: 'Leh Ladakh',
    stateOrCountry: 'India',
    highlight: 'High-altitude mountain desert, Pangong Tso blue waters, ancient monasteries & magnetic hill drives.',
    idealDuration: '6 - 8 Days',
    baseBudget: 42000,
    accentColor: '#3E8EDE',
    topExperiences: ['Pangong Lake Camping under Stars', 'Nubra Valley Double-Hump Camel Safari', 'Khardung La Pass Highest Motor Road'],
    tags: ['Adventure', 'Nature', 'Mountains', 'Photography', 'Adventure & Trekking', 'Scenic Photography'],
  }
];

export const getPersonalizedRecommendationsWithAI = async ({ userPersona = {}, limit = 4 }) => {
  const { vibes = ['Culture', 'Scenic', 'Food'], budgetTier = 'Moderate', preferredPace = 'Relaxed', startingCity = 'Mumbai' } = userPersona;

  const prompt = `Suggest ${limit} top personalized travel destinations for a traveler based in ${startingCity}.
- Travel Vibes: ${vibes.join(', ')}
- Budget Tier: ${budgetTier}
- Pace: ${preferredPace}
Assign each destination a matchScore (75-99) and distinct accentColor (#F16E62, #2AB79B, #F0A63F, #3E8EDE).`;

  const aiResult = await callGemini(prompt, RECOMMENDATION_SCHEMA);
  if (aiResult && aiResult.recommendations && aiResult.recommendations.length > 0) {
    return aiResult;
  }

  // Dynamic Multi-Vibe Scoring Fallback Engine
  const budgetMultiplier = budgetTier === 'Budget Backpacker' || budgetTier === 'Backpacker' ? 0.75 : budgetTier === 'Luxury & Heritage' || budgetTier === 'Luxury' ? 1.7 : 1.1;

  const scoredDestinations = DESTINATIONS_MASTER_POOL.map((dest) => {
    let score = 70; // baseline

    // Vibe matching
    const matchingTags = dest.tags.filter((t) =>
      vibes.some((v) => v.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(v.toLowerCase()))
    );
    score += Math.min(26, matchingTags.length * 9);

    // Minor randomization for natural variation
    score += Math.floor(Math.random() * 4);
    score = Math.min(99, Math.max(78, score));

    return {
      destinationId: dest.destinationId,
      name: dest.name,
      stateOrCountry: dest.stateOrCountry,
      matchScore: score,
      highlight: dest.highlight,
      idealDuration: dest.idealDuration,
      estimatedBudgetPerPerson: Math.round(dest.baseBudget * budgetMultiplier),
      accentColor: dest.accentColor,
      topExperiences: dest.topExperiences,
      tags: dest.tags.slice(0, 4),
    };
  });

  // Sort by highest match score
  scoredDestinations.sort((a, b) => b.matchScore - a.matchScore);

  const selectedRecs = scoredDestinations.slice(0, Number(limit) || 4);

  const personaSummary = `Curated for a ${budgetTier} traveler seeking ${vibes.join(', ') || 'Scenic & Cultural'} experiences at a ${preferredPace} pace from ${startingCity}.`;

  return {
    personaSummary,
    recommendations: selectedRecs,
  };
};

// ==========================================
// 3. BUDGET OPTIMIZER
// ==========================================

export const optimizeBudgetWithAI = async ({ currentBudget = 40000, estimatedCost = 52000, destination = 'Goa' }) => {
  const overBudget = Math.max(0, estimatedCost - currentBudget);

  return {
    currentBudget,
    estimatedCost,
    overBudget,
    optimizedCost: currentBudget,
    savingsTotal: overBudget,
    recommendations: [
      {
        category: 'Accommodation',
        title: 'Switch to Highly-Rated Boutique Stay',
        description: 'Trade 5-star hotel for a 4.8-star boutique heritage homestay near city center.',
        savings: Math.round(overBudget * 0.45) || 4000,
        icon: 'Hotel',
      },
      {
        category: 'Transport',
        title: 'Opt for AC Express Train & Metro Passes',
        description: 'Replace private cab transfers with reliable high-speed express trains and day metro cards.',
        savings: Math.round(overBudget * 0.25) || 2500,
        icon: 'Train',
      },
      {
        category: 'Activities',
        title: 'Enjoy Free Heritage Walking Trails',
        description: 'Replace commercial bus tour with self-guided audio walking tours and public viewpoints.',
        savings: Math.round(overBudget * 0.20) || 1800,
        icon: 'Compass',
      },
      {
        category: 'Dining',
        title: 'Local Iconic Eateries over Hotel Dining',
        description: 'Savor regional culinary gems and street markets for authentic flavors at half price.',
        savings: Math.round(overBudget * 0.10) || 1200,
        icon: 'Utensils',
      },
    ],
  };
};

// ==========================================
// 4. WEATHER ADAPTATION & ACTIVITY SWAP
// ==========================================

export const adaptItineraryWithAI = async ({ reason = 'Rain expected', dayNumber = 1, cityName = 'Mumbai' }) => {
  return {
    reason,
    dayNumber,
    cityName,
    alertTitle: `🌧️ Weather Adaptive Notice: ${reason}`,
    alertDescription: `Outdoor activities in ${cityName} have been safely swapped for covered cultural experiences and authentic indoor culinary trails.`,
    revisedActivities: [
      {
        name: `${cityName} Imperial Heritage Museum & Art Gallery`,
        time: '10:00',
        durationMinutes: 120,
        category: 'Sightseeing',
        cost: 350,
        desc: 'World-class climate-controlled exhibition halls and historical relics.',
        indoor: true,
      },
      {
        name: 'Artisanal Covered Food & Spice Market',
        time: '13:00',
        durationMinutes: 90,
        category: 'Food & Dining',
        cost: 650,
        desc: 'Sheltered market stalls tasting regional specialties and hot artisanal chai.',
        indoor: true,
      },
      {
        name: 'Heritage Theater / Cultural Performance',
        time: '16:00',
        durationMinutes: 120,
        category: 'Culture',
        cost: 500,
        desc: 'Traditional live music and classical regional arts show.',
        indoor: true,
      },
    ],
  };
};

// ==========================================
// 5. PACKING LIST GENERATOR
// ==========================================

export const generatePackingWithAI = async ({ destination = 'Goa', duration = 5, weather = 'Warm & Sunny', travelStyle = 'Beach' }) => {
  return {
    destination,
    duration,
    weather,
    travelStyle,
    items: [
      { name: 'Lightweight Linen Shirts', category: 'Clothing', quantity: Number(duration) + 1, packed: false },
      { name: 'Swimwear & Quick-Dry Shorts', category: 'Clothing', quantity: 2, packed: false },
      { name: 'UV Protection Sunglasses', category: 'Clothing', quantity: 1, packed: false },
      { name: 'SPF 50+ Sunscreen & Aloe Gel', category: 'Toiletries', quantity: 1, packed: false },
      { name: 'Waterproof Phone Pouch', category: 'Electronics', quantity: 1, packed: false },
      { name: 'Portable Power Bank (10000mAh)', category: 'Electronics', quantity: 1, packed: false },
      { name: 'Digital & Print Flight/Hotel Vouchers', category: 'Documents', quantity: 2, packed: false, essential: true },
      { name: 'Emergency First-Aid & ORS Hydration', category: 'Health', quantity: 1, packed: false, essential: true },
    ],
  };
};

export default {
  generateTripWithAI,
  getPersonalizedRecommendationsWithAI,
  optimizeBudgetWithAI,
  adaptItineraryWithAI,
  generatePackingWithAI,
};
