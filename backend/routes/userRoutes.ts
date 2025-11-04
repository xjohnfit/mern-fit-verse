import express from 'express';
import {
    authUser,
    getUserProfile,
    logoutUser,
    registerUser,
    updateUserProfile,
} from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;
