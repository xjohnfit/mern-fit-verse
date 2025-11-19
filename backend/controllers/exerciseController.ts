import {Request, Response} from 'express';
import asyncHandler from 'express-async-handler';
import ExerciseModel from '../models/exerciseModel';

export const getAllExercises = asyncHandler(async (req: Request, res: Response) => {
    const exercises = await ExerciseModel.find();
    res.json(exercises);
});

export const getExerciseById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const exercise = await ExerciseModel.findById(id);
    if (exercise) {
        res.json(exercise);
    } else {
        res.status(404).json({ message: 'Exercise not found' });
    }
});

export const createExercise = asyncHandler(async (req: Request, res: Response) => {
    const exerciseData = req.body;
    const newExercise = new ExerciseModel(exerciseData);
    const savedExercise = await newExercise.save();
    res.status(201).json(savedExercise);
});

export const updateExercise = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const exerciseData = req.body;
    const updatedExercise = await ExerciseModel.findByIdAndUpdate(id, exerciseData, { new: true });
    if (updatedExercise) {
        res.json(updatedExercise);
    } else {
        res.status(404).json({ message: 'Exercise not found' });
    }
});

export const deleteExercise = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedExercise = await ExerciseModel.findByIdAndDelete(id);
    if (deletedExercise) {
        res.json({ message: 'Exercise deleted successfully' });
    } else {
        res.status(404).json({ message: 'Exercise not found' });
    }
});