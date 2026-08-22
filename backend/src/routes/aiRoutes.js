import express from 'express';
import {
  handleGenerateTripWithAI,
  handleGetPersonalizedRecommendations,
  handleOptimizeBudget,
  handleSwapActivity,
  handleGeneratePacking,
  getRecommendations,
} from '../controllers/aiController.js';

const router = express.Router();

// Itinerary Generation
router.post('/generate-trip', handleGenerateTripWithAI);
router.post('/generate-itinerary', handleGenerateTripWithAI);

// Personalized Recommendations
router.get('/recommendations', getRecommendations);
router.get('/personalized-recommendations', handleGetPersonalizedRecommendations);
router.post('/personalized-recommendations', handleGetPersonalizedRecommendations);

// Smart Optimizers & Adaptation
router.post('/optimize-budget', handleOptimizeBudget);
router.post('/swap-activity', handleSwapActivity);
router.post('/generate-packing', handleGeneratePacking);

export default router;
