import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import ExerciseModel from '../models/exerciseModel';
import { v2 as cloudinary } from 'cloudinary';

export const getAllExercises = asyncHandler(
    async (req: Request, res: Response) => {
        const exercises = await ExerciseModel.find();
        res.json(exercises);
    }
);

export const getExerciseById = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const exercise = await ExerciseModel.findById(id);
        if (exercise) {
            res.json(exercise);
        } else {
            res.status(404).json({ message: 'Exercise not found' });
        }
    }
);

export const createExercise = asyncHandler(
    async (req: Request, res: Response) => {
        let { image, ...exerciseData } = req.body;

        // Upload image to Cloudinary if provided
        if (image && image.startsWith('data:image')) {
            const uploadedImage = await cloudinary.uploader.upload(image, {
                folder: 'fit-verse/exercises',
                resource_type: 'auto',
                format: 'jpg',
            });
            image = uploadedImage.secure_url;
        }

        const newExercise = new ExerciseModel({ ...exerciseData, image });
        const savedExercise = await newExercise.save();
        res.status(201).json(savedExercise);
    }
);

export const updateExercise = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        let { image, ...exerciseData } = req.body;

        // Upload image to Cloudinary if it's a new base64 image
        if (image && image.startsWith('data:image')) {
            const uploadedImage = await cloudinary.uploader.upload(image, {
                folder: 'fit-verse/exercises',
                resource_type: 'auto',
                format: 'jpg',
            });
            image = uploadedImage.secure_url;
        }

        const updatedExercise = await ExerciseModel.findByIdAndUpdate(
            id,
            { ...exerciseData, image },
            { new: true }
        );
        if (updatedExercise) {
            res.json(updatedExercise);
        } else {
            res.status(404).json({ message: 'Exercise not found' });
        }
    }
);

export const deleteExercise = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const deletedExercise = await ExerciseModel.findByIdAndDelete(id);
        if (deletedExercise) {
            res.json({ message: 'Exercise deleted successfully' });
        } else {
            res.status(404).json({ message: 'Exercise not found' });
        }
    }
);

export const getExercisesByCategory = asyncHandler(
    async (req: Request, res: Response) => {
        const exercises = await ExerciseModel.find().sort({
            category: 1,
            name: 1,
        });

        // Group exercises by category
        const exercisesByCategory = exercises.reduce(
            (acc: Record<string, any[]>, exercise) => {
                const category = exercise.category;
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(exercise);
                return acc;
            },
            {}
        );

        res.json(exercisesByCategory);
    }
);
