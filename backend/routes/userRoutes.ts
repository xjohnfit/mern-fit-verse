import express from 'express';
import { protect } from '../middlewares/authMiddleware';

import {
    followUnfollowUser,
    getSuggestedUsers,
    getUserProfile,
    updateUserProfile,
    viewUserProfile,
} from '../controllers/userController';

const router = express.Router();

router.get('/profile', protect, getUserProfile); // Get logged-in user's profile
router.put('/profile', protect, updateUserProfile); // Update logged-in user's profile
router.get('/profile/view/suggested', protect, getSuggestedUsers); // Get suggested users to follow
router.get('/profile/view/:username', protect, viewUserProfile); // View another user's profile
router.post('/profile/follow/:username', protect, followUnfollowUser); // Follow/Unfollow a user

export default router;
