import { getMessages, sendMessage } from '../controllers/messageController';
import { protect } from '../middlewares/authMiddleware';
import express from 'express';

const router = express.Router();

router.get('/:senderId/:receiverId', protect, getMessages);
router.post('/send', protect, sendMessage);

export default router;
