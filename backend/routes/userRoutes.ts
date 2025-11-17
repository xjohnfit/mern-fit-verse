import express, { Request, Response, NextFunction } from 'express';
import { protect } from '../middlewares/authMiddleware';
import upload from '../middlewares/uploadMiddleware';
import multer from 'multer';

import {
    followUnfollowUser,
    getSuggestedUsers,
    getUserProfile,
    updateUserProfile,
    viewUserProfile,
    updateNutritionGoals,
} from '../controllers/userController';

const router = express.Router();

// Multer error handling middleware
const handleMulterError = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(413).json({
                success: false,
                message: 'File too large. Maximum size is 10MB.',
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
        });
        return;
    } else if (err) {
        console.error('Upload error:', err);
        res.status(400).json({
            success: false,
            message: err.message || 'File upload failed',
        });
        return;
    }
    next();
};

router.get('/profile', protect, getUserProfile); // Get logged-in user's profile
router.put(
    '/profile',
    protect,
    upload.single('photo'),
    handleMulterError,
    updateUserProfile
); // Update logged-in user's profile
router.put('/nutrition-goals', protect, updateNutritionGoals); // Update nutrition goals
router.get('/profile/view/suggested', protect, getSuggestedUsers); // Get suggested users to follow
router.get('/profile/view/:username', protect, viewUserProfile); // View another user's profile
router.post('/profile/follow/:username', protect, followUnfollowUser); // Follow/Unfollow a user

export default router;
