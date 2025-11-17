import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
    getCustomCategories,
    addCustomCategory,
    deleteCustomCategory,
} from '../controllers/customCategoryController';

const router = express.Router();

router.use(protect); // Protect all custom category routes

router.get('/', getCustomCategories);
router.post('/add', addCustomCategory);
router.delete('/delete/:categoryId', deleteCustomCategory);

export default router;
