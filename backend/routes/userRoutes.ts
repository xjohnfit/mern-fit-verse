import express from 'express';
import { registerUser } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
// router.post('/auth', authUser);
// router.post('/logout', logoutUser);
// router.get('/profile', getUserProfile);
// router.put('/profile', updateUserProfile);

export default router;