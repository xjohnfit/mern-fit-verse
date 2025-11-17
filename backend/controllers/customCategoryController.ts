import { Request, Response } from 'express';
import CustomCategory from '../models/customCategoryModel';

export const getCustomCategories = async (
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

        const categories = await CustomCategory.find({ user: userId }).sort({
            order: 1,
        });

        res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Error fetching custom categories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching custom categories',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const addCustomCategory = async (
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

        const { name, color } = req.body;

        if (!name || !color) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields: name, color',
            });
            return;
        }

        // Check if user already has 3 custom categories
        const existingCategories = await CustomCategory.countDocuments({
            user: userId,
        });
        if (existingCategories >= 3) {
            res.status(400).json({
                success: false,
                message: 'Maximum of 3 custom categories allowed',
            });
            return;
        }

        // Create new custom category with the next order number
        const newCategory = await CustomCategory.create({
            user: userId,
            name: name.trim(),
            color,
            order: existingCategories,
        });

        res.status(201).json({
            success: true,
            message: 'Custom category created successfully',
            data: newCategory,
        });
    } catch (error) {
        console.error('Error adding custom category:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding custom category',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export const deleteCustomCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const { categoryId } = req.params;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }

        if (!categoryId) {
            res.status(400).json({
                success: false,
                message: 'Category ID is required',
            });
            return;
        }

        // Find and delete the category, ensuring it belongs to the user
        const deletedCategory = await CustomCategory.findOneAndDelete({
            _id: categoryId,
            user: userId,
        });

        if (!deletedCategory) {
            res.status(404).json({
                success: false,
                message: 'Custom category not found or unauthorized',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Custom category deleted successfully',
            data: deletedCategory,
        });
    } catch (error) {
        console.error('Error deleting custom category:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting custom category',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
