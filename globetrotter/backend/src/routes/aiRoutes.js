import express from 'express';
import { handleGenerateTripWithAI, getRecommendations } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate-trip', handleGenerateTripWithAI);
router.get('/recommendations', getRecommendations);

export default router;
