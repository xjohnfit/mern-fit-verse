import {
    getMessages,
    sendMessage,
    getUsersWithMessages,
    shareTemplate,
} from '../controllers/messageController';
import { protect } from '../middlewares/authMiddleware';
import express from 'express';

const router = express.Router();

router.get('/users/:userId', protect, getUsersWithMessages);
router.get('/:senderId/:receiverId', protect, getMessages);
router.post('/send', protect, sendMessage);
router.post('/share-template', protect, shareTemplate);

export default router;
