import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { admin } from '../middlewares/adminMiddleware';

import {
    followUnfollowUser,
    getSuggestedUsers,
    getUserProfile,
    updateUserProfile,
    viewUserProfile,
    updateNutritionGoals,
    getAllUsers,
    updateUserRole,
    updatePushToken,
    getFollowing,
} from '../controllers/userController';

const router = express.Router();

router.get('/profile', protect, getUserProfile); // Get logged-in user's profile
router.put('/profile', protect, updateUserProfile); // Update logged-in user's profile
router.put('/nutrition-goals', protect, updateNutritionGoals); // Update nutrition goals
router.get('/profile/view/suggested', protect, getSuggestedUsers); // Get suggested users to follow
router.get('/profile/view/:username', protect, viewUserProfile); // View another user's profile
router.post('/profile/follow/:username', protect, followUnfollowUser); // Follow/Unfollow a user
router.get('/following', protect, getFollowing); // Get user's following list

// Admin routes
router.get('/admin/users', protect, admin, getAllUsers); // Admin: Get all users
router.put('/admin/users/:userId/role', protect, admin, updateUserRole); // Admin: Update user role

// Save/Update push notification token
router.post('/push-token', protect, updatePushToken);
export default router;
