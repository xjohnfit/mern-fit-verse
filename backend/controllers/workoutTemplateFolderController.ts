import { Request, Response } from 'express';
import WorkoutTemplateFolder from '../models/workoutTemplateFolderModel';
import WorkoutTemplate from '../models/workoutTemplateModel';

// @desc    Get all template folders for the authenticated user
// @route   GET /api/workout-template-folders
// @access  Private
export const getTemplateFolders = async (
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

        const folders = await WorkoutTemplateFolder.find({ userId }).sort({
            order: 1,
        });

        res.status(200).json({
            success: true,
            data: folders,
        });
    } catch (error) {
        console.error('Error fetching template folders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching template folders',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Create a new template folder
// @route   POST /api/workout-template-folders
// @access  Private
export const createTemplateFolder = async (
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

        if (!name) {
            res.status(400).json({
                success: false,
                message: 'Folder name is required',
            });
            return;
        }

        // Get the current max order value
        const existingFolders = await WorkoutTemplateFolder.countDocuments({
            userId,
        });

        const newFolder = await WorkoutTemplateFolder.create({
            userId,
            name: name.trim(),
            color: color || '#6366f1', // default indigo-500
            order: existingFolders,
        });

        res.status(201).json({
            success: true,
            message: 'Template folder created successfully',
            data: newFolder,
        });
    } catch (error) {
        console.error('Error creating template folder:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating template folder',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Update a template folder
// @route   PUT /api/workout-template-folders/:id
// @access  Private
export const updateTemplateFolder = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const folderId = req.params.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }

        const { name, color } = req.body;

        const folder = await WorkoutTemplateFolder.findOne({
            _id: folderId,
            userId,
        });

        if (!folder) {
            res.status(404).json({
                success: false,
                message: 'Template folder not found',
            });
            return;
        }

        if (name !== undefined) folder.name = name.trim();
        if (color !== undefined) folder.color = color;

        await folder.save();

        res.status(200).json({
            success: true,
            message: 'Template folder updated successfully',
            data: folder,
        });
    } catch (error) {
        console.error('Error updating template folder:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating template folder',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Delete a template folder
// @route   DELETE /api/workout-template-folders/:id
// @access  Private
export const deleteTemplateFolder = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const folderId = req.params.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }

        const folder = await WorkoutTemplateFolder.findOne({
            _id: folderId,
            userId,
        });

        if (!folder) {
            res.status(404).json({
                success: false,
                message: 'Template folder not found',
            });
            return;
        }

        // Move all templates in this folder to no folder (folderId = null)
        await WorkoutTemplate.updateMany(
            { folderId, userId },
            { $unset: { folderId: 1 } }
        );

        await folder.deleteOne();

        // Reorder remaining folders
        const remainingFolders = await WorkoutTemplateFolder.find({
            userId,
        }).sort({ order: 1 });

        for (let i = 0; i < remainingFolders.length; i++) {
            remainingFolders[i].order = i;
            await remainingFolders[i].save();
        }

        res.status(200).json({
            success: true,
            message: 'Template folder deleted successfully',
            data: folder,
        });
    } catch (error) {
        console.error('Error deleting template folder:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting template folder',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Reorder template folders
// @route   PUT /api/workout-template-folders/reorder
// @access  Private
export const reorderTemplateFolders = async (
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

        const { folderIds } = req.body; // Array of folder IDs in new order

        if (!Array.isArray(folderIds)) {
            res.status(400).json({
                success: false,
                message: 'folderIds must be an array',
            });
            return;
        }

        // Update order for each folder
        const updatePromises = folderIds.map((folderId, index) =>
            WorkoutTemplateFolder.findOneAndUpdate(
                { _id: folderId, userId },
                { order: index },
                { new: true }
            )
        );

        await Promise.all(updatePromises);

        const updatedFolders = await WorkoutTemplateFolder.find({
            userId,
        }).sort({ order: 1 });

        res.status(200).json({
            success: true,
            message: 'Template folders reordered successfully',
            data: updatedFolders,
        });
    } catch (error) {
        console.error('Error reordering template folders:', error);
        res.status(500).json({
            success: false,
            message: 'Error reordering template folders',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
