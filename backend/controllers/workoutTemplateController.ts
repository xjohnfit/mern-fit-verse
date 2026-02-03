import { Request, Response } from 'express';
import WorkoutTemplate from '../models/workoutTemplateModel';

// @desc    Get all templates for the authenticated user
// @route   GET /api/workout-templates
// @access  Private
export const getTemplates = async (
    req: Request,
    res: Response,
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

        const templates = await WorkoutTemplate.find({ userId }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            data: templates,
        });
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching templates',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Get a single template by ID
// @route   GET /api/workout-templates/:id
// @access  Private
export const getTemplateById = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const templateId = req.params.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }

        const template = await WorkoutTemplate.findOne({
            _id: templateId,
            userId,
        });

        if (!template) {
            res.status(404).json({
                success: false,
                message: 'Template not found',
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: template,
        });
    } catch (error) {
        console.error('Error fetching template:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching template',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Create a new template
// @route   POST /api/workout-templates
// @access  Private
export const createTemplate = async (
    req: Request,
    res: Response,
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

        const { name, description, exercises, folderId, isPublic } = req.body;

        if (!name || !exercises || exercises.length === 0) {
            res.status(400).json({
                success: false,
                message: 'Template name and at least one exercise are required',
            });
            return;
        }

        const newTemplate = await WorkoutTemplate.create({
            userId,
            name: name.trim(),
            description: description?.trim(),
            exercises,
            folderId: folderId || undefined,
            isPublic: isPublic || false,
        });

        res.status(201).json({
            success: true,
            message: 'Template created successfully',
            data: newTemplate,
        });
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating template',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Update a template
// @route   PUT /api/workout-templates/:id
// @access  Private
export const updateTemplate = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const templateId = req.params.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }

        const { name, description, exercises, folderId, isPublic } = req.body;

        const template = await WorkoutTemplate.findOne({
            _id: templateId,
            userId,
        });

        if (!template) {
            res.status(404).json({
                success: false,
                message: 'Template not found',
            });
            return;
        }

        if (name !== undefined) template.name = name.trim();
        if (description !== undefined)
            template.description = description.trim();
        if (exercises !== undefined) template.exercises = exercises;
        if (folderId !== undefined) template.folderId = folderId || undefined;
        if (isPublic !== undefined) template.isPublic = isPublic;

        await template.save();

        res.status(200).json({
            success: true,
            message: 'Template updated successfully',
            data: template,
        });
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating template',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Delete a template
// @route   DELETE /api/workout-templates/:id
// @access  Private
export const deleteTemplate = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const templateId = req.params.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }

        const template = await WorkoutTemplate.findOne({
            _id: templateId,
            userId,
        });

        if (!template) {
            res.status(404).json({
                success: false,
                message: 'Template not found',
            });
            return;
        }

        await template.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Template deleted successfully',
            data: template,
        });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting template',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Move a template to a folder (or remove from folder)
// @route   PATCH /api/workout-templates/:id/move
// @access  Private
export const moveTemplateToFolder = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const templateId = req.params.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }

        const { folderId } = req.body; // null or undefined to remove from folder

        const template = await WorkoutTemplate.findOne({
            _id: templateId,
            userId,
        });

        if (!template) {
            res.status(404).json({
                success: false,
                message: 'Template not found',
            });
            return;
        }

        template.folderId = folderId || undefined;
        await template.save();

        res.status(200).json({
            success: true,
            message: 'Template moved successfully',
            data: template,
        });
    } catch (error) {
        console.error('Error moving template:', error);
        res.status(500).json({
            success: false,
            message: 'Error moving template',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// @desc    Import a shared template
// @route   POST /api/workout-templates/import/:id
// @access  Private
export const importTemplate = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?._id;
        const templateId = req.params.id;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
            return;
        }

        // Find the original template
        const originalTemplate = await WorkoutTemplate.findById(templateId);

        if (!originalTemplate) {
            res.status(404).json({
                success: false,
                message: 'Template not found',
            });
            return;
        }

        // Create a copy for the current user
        const importedTemplate = new WorkoutTemplate({
            userId: userId,
            name: `${originalTemplate.name} (imported)`,
            description: originalTemplate.description,
            exercises: originalTemplate.exercises,
            folderId: undefined, // Don't assign to any folder by default
        });

        await importedTemplate.save();

        res.status(201).json({
            success: true,
            message: 'Template imported successfully',
            data: importedTemplate,
        });
    } catch (error) {
        console.error('Error importing template:', error);
        res.status(500).json({
            success: false,
            message: 'Error importing template',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
