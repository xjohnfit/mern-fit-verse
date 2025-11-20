import express from 'express';
import {
    getTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    moveTemplateToFolder,
} from '../controllers/workoutTemplateController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes for workout templates
router.route('/').get(getTemplates).post(createTemplate);

router
    .route('/:id')
    .get(getTemplateById)
    .put(updateTemplate)
    .delete(deleteTemplate);

router.route('/:id/move').patch(moveTemplateToFolder);

export default router;
