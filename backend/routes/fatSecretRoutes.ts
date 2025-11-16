import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
    getFoodAutocomplete,
    searchFoods,
    getFoodById,
    checkFatSecretHealth,
} from '../controllers/fatSecretController';

const router = express.Router();

// Health check endpoint (public for monitoring)
router.get('/health', checkFatSecretHealth);

// Food autocomplete - requires authentication
router.get('/autocomplete', protect, getFoodAutocomplete);

// Food search - requires authentication
router.get('/search', protect, searchFoods);

// Get food details by ID - requires authentication
router.get('/food/:foodId', protect, getFoodById);

export default router;
