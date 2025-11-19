import { Request, Response } from 'express';
import Workout from '../models/workoutModel';
import User from '../models/userModel';
import {
    convertWorkoutWeights,
    convertWorkoutWeightsForStorage,
} from '../utils/weightConversion';

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private
export const createWorkout = async (req: Request, res: Response) => {
    try {
        const {
            workoutType,
            templateId,
            duration,
            exercises,
            completedAt,
            notes,
        } = req.body;

        // Validate required fields
        if (!duration || !exercises || exercises.length === 0) {
            res.status(400).json({
                message: 'Duration and exercises are required',
            });
            return;
        }

        // Get user's weight unit preference
        const user = await User.findById(req.user._id);
        const userWeightUnit = user?.weightUnit || 'lbs';

        // Convert weights from user's unit to lbs for storage
        const workoutData = {
            workoutType: workoutType || 'freestyle',
            templateId,
            duration,
            exercises,
            completedAt: completedAt || new Date(),
            notes,
        };
        const convertedWorkoutData = convertWorkoutWeightsForStorage(
            workoutData,
            userWeightUnit
        );

        // Create workout
        const workout = await Workout.create({
            userId: req.user._id,
            ...convertedWorkoutData,
        });

        // Add workout ID to user's workouts array
        await User.findByIdAndUpdate(
            req.user._id,
            { $push: { workouts: workout._id } },
            { new: true }
        );

        res.status(201).json(workout);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all workouts for the authenticated user
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = async (req: Request, res: Response) => {
    try {
        const workouts = await Workout.find({ userId: req.user._id })
            .sort({ completedAt: -1 })
            .limit(50);

        // Get user's weight unit preference
        const user = await User.findById(req.user._id);
        const userWeightUnit = user?.weightUnit || 'lbs';

        // Convert weights to user's preferred unit
        const convertedWorkouts = workouts.map((workout) =>
            convertWorkoutWeights(workout.toObject(), userWeightUnit)
        );

        res.json(convertedWorkouts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single workout by ID
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkoutById = async (req: Request, res: Response) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            res.status(404).json({ message: 'Workout not found' });
            return;
        }

        // Check if the workout belongs to the authenticated user
        if (workout.userId.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        // Get user's weight unit preference
        const user = await User.findById(req.user._id);
        const userWeightUnit = user?.weightUnit || 'lbs';

        // Convert weights to user's preferred unit
        const convertedWorkout = convertWorkoutWeights(
            workout.toObject(),
            userWeightUnit
        );

        res.json(convertedWorkout);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = async (req: Request, res: Response) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            res.status(404).json({ message: 'Workout not found' });
            return;
        }

        // Check if the workout belongs to the authenticated user
        if (workout.userId.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        const updatedWorkout = await Workout.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedWorkout);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = async (req: Request, res: Response) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            res.status(404).json({ message: 'Workout not found' });
            return;
        }

        // Check if the workout belongs to the authenticated user
        if (workout.userId.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        await Workout.findByIdAndDelete(req.params.id);

        // Remove workout ID from user's workouts array
        await User.findByIdAndUpdate(req.user._id, {
            $pull: { workouts: req.params.id },
        });

        res.json({ message: 'Workout deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get workout statistics for the authenticated user
// @route   GET /api/workouts/stats
// @access  Private
export const getWorkoutStats = async (req: Request, res: Response) => {
    try {
        const totalWorkouts = await Workout.countDocuments({
            userId: req.user._id,
        });

        // Get workouts this week
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        const workoutsThisWeek = await Workout.countDocuments({
            userId: req.user._id,
            completedAt: { $gte: startOfWeek },
        });

        res.json({
            totalWorkouts,
            workoutsThisWeek,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
