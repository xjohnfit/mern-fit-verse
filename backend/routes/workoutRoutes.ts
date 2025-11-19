import express from 'express';
import {
    createWorkout,
    getWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
    getWorkoutStats,
} from '../controllers/workoutController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createWorkout).get(protect, getWorkouts);
router.route('/stats').get(protect, getWorkoutStats);
router
    .route('/:id')
    .get(protect, getWorkoutById)
    .put(protect, updateWorkout)
    .delete(protect, deleteWorkout);

export default router;
