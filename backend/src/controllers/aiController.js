import { generateTripWithAI, optimizeBudgetWithAI, adaptItineraryWithAI, generatePackingWithAI } from '../services/aiService.js';

export const handleGenerateTripWithAI = async (req, res) => {
  try {
    const { destination, days, budget, travelers, travelStyle, interests } = req.body;
    const generated = await generateTripWithAI({
      destination: destination || 'Goa',
      days: Number(days) || 5,
      budget: Number(budget) || 45000,
      travelers: Number(travelers) || 2,
      travelStyle: travelStyle || 'Balanced Explorer',
      interests: interests || ['Culture', 'Food'],
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

export const getRecommendations = async (req, res) => {
  try {
    const { userStyle, currentCity } = req.query;
    const recs = await adaptItineraryWithAI({
      destination: currentCity || 'Mumbai',
      weatherAlert: 'Sunny',
      originalActivities: [],
    });

    return res.json({
      success: true,
      recommendations: recs,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { handleGenerateTripWithAI, getRecommendations };
