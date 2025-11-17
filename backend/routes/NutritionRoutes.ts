import {
    addNutritionEntry,
    deleteNutritionEntry,
    getDailyNutrition,
} from '../controllers/nutritionController';
import express from 'express';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect); // Protect all nutrition routes

router.get('/', getDailyNutrition);
router.post('/add', addNutritionEntry);
router.delete('/delete/:entryId', deleteNutritionEntry);

export default router;
