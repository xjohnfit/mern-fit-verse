import { Request, Response } from 'express';
import NutritionEntry from '../models/nutritionModel';

export const getDailyNutrition = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const { date } = req.query;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }

        // If date is provided, get entries for that specific date
        // Otherwise, get today's entries
        const targetDate = date ? new Date(date as string) : new Date();
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        const entries = await NutritionEntry.find({
            user: userId,
            date: { $gte: startOfDay, $lte: endOfDay },
        }).sort({ createdAt: -1 });

        // Calculate totals
        const totals = entries.reduce(
            (acc, entry) => ({
                calories: acc.calories + entry.calories,
                protein: acc.protein + entry.protein,
                carbs: acc.carbs + entry.carbs,
                fats: acc.fats + entry.fats,
            }),
            { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );

        res.status(200).json({
            success: true,
            data: {
                entries,
                totals,
                date: targetDate,
            },
        });
    } catch (error) {
        console.error('Error fetching daily nutrition:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching daily nutrition data',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const addNutritionEntry = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }

        const {
            date,
            mealCategory,
            customCategoryId,
            foodItem,
            calories,
            protein,
            carbs,
            fats,
        } = req.body;

        // Validation
        if (
            !mealCategory ||
            !foodItem ||
            calories === undefined ||
            protein === undefined ||
            carbs === undefined ||
            fats === undefined
        ) {
            res.status(400).json({
                success: false,
                message:
                    'Missing required fields: mealCategory, foodItem, calories, protein, carbs, fats',
            });
            return;
        }

        // Validate mealCategory
        const validCategories = [
            'breakfast',
            'lunch',
            'dinner',
            'snack',
            'custom',
        ];
        if (!validCategories.includes(mealCategory)) {
            res.status(400).json({
                success: false,
                message: `Invalid meal category. Must be one of: ${validCategories.join(
                    ', '
                )}`,
            });
            return;
        }

        // If custom category, ensure customCategoryId is provided
        if (mealCategory === 'custom' && !customCategoryId) {
            res.status(400).json({
                success: false,
                message:
                    'customCategoryId is required for custom meal categories',
            });
            return;
        }

        // Create new nutrition entry
        const newEntry = await NutritionEntry.create({
            user: userId,
            date: date ? new Date(date) : new Date(),
            mealCategory,
            customCategoryId:
                mealCategory === 'custom' ? customCategoryId : undefined,
            foodItem,
            calories: Number(calories),
            protein: Number(protein),
            carbs: Number(carbs),
            fats: Number(fats),
        });

        res.status(201).json({
            success: true,
            message: 'Nutrition entry added successfully',
            data: newEntry,
        });
    } catch (error) {
        console.error('Error adding nutrition entry:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding nutrition entry',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const deleteNutritionEntry = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const { entryId } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }

        if (!entryId) {
            res.status(400).json({
                success: false,
                message: 'Entry ID is required',
            });
            return;
        }

        // Find and delete the entry, ensuring it belongs to the user
        const deletedEntry = await NutritionEntry.findOneAndDelete({
            _id: entryId,
            user: userId,
        });

        if (!deletedEntry) {
            res.status(404).json({
                success: false,
                message: 'Nutrition entry not found or unauthorized',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Nutrition entry deleted successfully',
            data: deletedEntry,
        });
    } catch (error) {
        console.error('Error deleting nutrition entry:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting nutrition entry',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
