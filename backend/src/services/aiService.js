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

export const getPersonalizedRecommendationsWithAI = async ({ userPersona = {}, limit = 4 }) => {
  const { vibes = ['Culture', 'Scenic', 'Food'], budgetTier = 'Moderate', preferredPace = 'Relaxed', startingCity = 'Mumbai' } = userPersona;

  const prompt = `Suggest ${limit} top personalized travel destinations for a traveler based in ${startingCity}.
- Travel Vibes: ${vibes.join(', ')}
- Budget Tier: ${budgetTier}
- Pace: ${preferredPace}
Assign each destination a matchScore (75-99) and distinct accentColor (#F16E62, #2AB79B, #F0A63F, #3E8EDE).`;

  const aiResult = await callGemini(prompt, RECOMMENDATION_SCHEMA);
  if (aiResult && aiResult.recommendations) {
    return aiResult;
  }

  // High-fidelity fallback
  return {
    personaSummary: `Curated for a ${budgetTier} traveler who loves ${vibes.join(' & ')} at a ${preferredPace} pace.`,
    recommendations: [
      {
        destinationId: 'dest-udaipur',
        name: 'Udaipur, Rajasthan',
        stateOrCountry: 'India',
        matchScore: 96,
        highlight: 'Romantic lake palaces, heritage boat rides, and rooftop Mewari dining.',
        idealDuration: '3 - 4 Days',
        estimatedBudgetPerPerson: 18000,
        accentColor: '#F16E62',
        topExperiences: ['City Palace Tour', 'Lake Pichola Sunset Cruise', 'Bagore Ki Haveli Dance Show'],
        tags: ['Heritage', 'Romantic', 'Architecture', 'Culture'],
      },
      {
        destinationId: 'dest-munnar',
        name: 'Munnar, Kerala',
        stateOrCountry: 'India',
        matchScore: 92,
        highlight: 'Emerald tea plantations, misty mountain vistas, and Ayurvedic wellness.',
        idealDuration: '3 - 5 Days',
        estimatedBudgetPerPerson: 15000,
        accentColor: '#2AB79B',
        topExperiences: ['Kolukkumalai Sunrise Jeep Safari', 'Tea Museum & Tasting', 'Eravikulam National Park'],
        tags: ['Nature', 'Relaxation', 'Scenic', 'Trekking'],
      },
      {
        destinationId: 'dest-varanasi',
        name: 'Varanasi, Uttar Pradesh',
        stateOrCountry: 'India',
        matchScore: 89,
        highlight: 'Ancient spiritual ghats, evening Ganga Aarti, and legendary silk weaving.',
        idealDuration: '2 - 3 Days',
        estimatedBudgetPerPerson: 11000,
        accentColor: '#F0A63F',
        topExperiences: ['Dawn Boat Ride on Ganga', 'Dashashwamedh Aarti', 'Kashi Street Food Trail'],
        tags: ['Spiritual', 'Street Food', 'Historic', 'Photography'],
      },
      {
        destinationId: 'dest-hampi',
        name: 'Hampi, Karnataka',
        stateOrCountry: 'India',
        matchScore: 87,
        highlight: 'UNESCO boulder landscape, Vijayanagara ruins, and riverside cafe culture.',
        idealDuration: '3 Days',
        estimatedBudgetPerPerson: 12500,
        accentColor: '#3E8EDE',
        topExperiences: ['Virupaksha Temple', 'Coracle Ride across Tungabhadra', 'Matanga Hill Sunset'],
        tags: ['Ruins', 'Adventure', 'UNESCO', 'Bohemian'],
      },
    ],
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
