import express from 'express';
import {
    getTemplateFolders,
    createTemplateFolder,
    updateTemplateFolder,
    deleteTemplateFolder,
    reorderTemplateFolders,
} from '../controllers/workoutTemplateFolderController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes for template folders
router.route('/').get(getTemplateFolders).post(createTemplateFolder);

router.route('/reorder').put(reorderTemplateFolders);

router.route('/:id').put(updateTemplateFolder).delete(deleteTemplateFolder);

export default router;
