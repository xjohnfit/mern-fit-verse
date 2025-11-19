import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { admin } from '../middlewares/adminMiddleware';
import {
    getAllExercises,
    getExerciseById,
    createExercise,
    updateExercise,
    deleteExercise,
} from '../controllers/exerciseController';

const router = express.Router();

router.get('/', getAllExercises);
router.get('/:id', getExerciseById);
router.post('/', protect, admin, createExercise);
router.put('/:id', protect, admin, updateExercise);
router.delete('/:id', protect, admin, deleteExercise);

export default router;
