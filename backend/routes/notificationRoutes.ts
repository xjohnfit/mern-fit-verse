import { deleteNotifications, getNotifications } from '../controllers/notificationController';
import { protect } from '../middlewares/authMiddleware';
import express from 'express';

const router = express.Router();

router.get('/', protect, getNotifications);
router.delete('/', protect, deleteNotifications);

export default router;