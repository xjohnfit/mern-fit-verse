import express from 'express';
import {
    blockUser,
    unblockUser,
    getBlockedUsers,
    checkIfBlocked,
} from '../controllers/blockController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

// Block/Unblock routes
router.post('/block/:userId', protect, blockUser);
router.delete('/block/:userId', protect, unblockUser);
router.get('/blocked', protect, getBlockedUsers);
router.get('/block-status/:userId', protect, checkIfBlocked);

export default router;
