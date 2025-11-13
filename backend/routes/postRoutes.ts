import express from 'express';

import { protect } from '../middlewares/authMiddleware';
import {
    addComment,
    createPost,
    deleteComment,
    deletePost,
    getFeedPosts,
    likeUnlikePost,
} from '../controllers/postController';

const router = express.Router();

router.post('/create', protect, createPost);
router.delete('/delete/:postId', protect, deletePost);
router.get('/feed', protect, getFeedPosts);
router.post('/like/:postId', protect, likeUnlikePost);
router.post('/comment/:postId', protect, addComment);
router.delete('/comment/:postId/:commentId', protect, deleteComment);

export default router;
