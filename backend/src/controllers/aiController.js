import {
  generateTripWithAI,
  getPersonalizedRecommendationsWithAI,
  optimizeBudgetWithAI,
  adaptItineraryWithAI,
  generatePackingWithAI,
} from '../services/aiService.js';

export const handleGenerateTripWithAI = async (req, res) => {
  try {
    const { destination, days, budget, travelers, travelStyle, interests, pace } = req.body;
    const generated = await generateTripWithAI({
      destination: destination || 'Goa',
      days: Number(days) || 5,
      budget: Number(budget) || 45000,
      travelers: Number(travelers) || 2,
      travelStyle: travelStyle || 'Balanced Explorer',
      interests: interests || ['Culture', 'Food'],
      pace: pace || 'Moderate',
    });

    return res.json({
      success: true,
      message: 'AI Itinerary synthesized successfully',
      data: generated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGetPersonalizedRecommendations = async (req, res) => {
  try {
    const { userPersona, limit } = req.body || {};
    const result = await getPersonalizedRecommendationsWithAI({
      userPersona: userPersona || {
        vibes: req.query.vibes ? req.query.vibes.split(',') : ['Culture', 'Scenic', 'Food'],
        budgetTier: req.query.budgetTier || 'Moderate',
        preferredPace: req.query.preferredPace || 'Relaxed',
        startingCity: req.query.startingCity || 'Mumbai',
      },
      limit: Number(limit) || 4,
    });

    return res.json({
      success: true,
      message: 'Personalized recommendations fetched successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleOptimizeBudget = async (req, res) => {
  try {
    const { currentBudget, estimatedCost, destination } = req.body;
    const result = await optimizeBudgetWithAI({
      currentBudget: Number(currentBudget) || 40000,
      estimatedCost: Number(estimatedCost) || 52000,
      destination: destination || 'Goa',
    });

    return res.json({
      success: true,
      message: 'Budget optimization strategies synthesized',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleSwapActivity = async (req, res) => {
  try {
    const { reason, dayNumber, cityName } = req.body;
    const result = await adaptItineraryWithAI({
      reason: reason || 'Inclement weather',
      dayNumber: Number(dayNumber) || 1,
      cityName: cityName || 'Mumbai',
    });

    return res.json({
      success: true,
      message: 'Adaptive activity replacement completed',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const handleGeneratePacking = async (req, res) => {
  try {
    const { destination, duration, weather, travelStyle } = req.body;
    const result = await generatePackingWithAI({
      destination: destination || 'Goa',
      duration: Number(duration) || 5,
      weather: weather || 'Sunny',
      travelStyle: travelStyle || 'Leisure',
    });

    return res.json({
      success: true,
      message: 'Packing essentials generated',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecommendations = handleGetPersonalizedRecommendations;

export default {
  handleGenerateTripWithAI,
  handleGetPersonalizedRecommendations,
  handleOptimizeBudget,
  handleSwapActivity,
  handleGeneratePacking,
  getRecommendations,
};
