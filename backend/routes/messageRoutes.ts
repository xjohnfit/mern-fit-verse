import {
    getMessages,
    sendMessage,
    getUsersWithMessages,
} from '../controllers/messageController';
import { protect } from '../middlewares/authMiddleware';
import express from 'express';

const router = express.Router();

router.get('/users/:userId', protect, getUsersWithMessages);
router.get('/:senderId/:receiverId', protect, getMessages);
router.post('/send', protect, sendMessage);

export default router;
