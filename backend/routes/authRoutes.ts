import express from 'express';
import { authUser, logoutUser, registerUser, deleteUser } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);
router.delete('/delete', protect, deleteUser);

export default router;
