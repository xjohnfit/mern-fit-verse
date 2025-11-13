import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { PostModel, IPost } from '../models/postModel';

export const createPost = asyncHandler(async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
    res.json({ message: 'Delete Post' });
});

export const getFeedPosts = asyncHandler(
    async (req: Request, res: Response) => {
        res.json({ message: 'Get Feed Posts' });
    }
);

export const likeUnlikePost = asyncHandler(
    async (req: Request, res: Response) => {
        res.json({ message: 'Like/Unlike Post' });
    }
);

export const addComment = asyncHandler(async (req: Request, res: Response) => {
    res.json({ message: 'Add Comment' });
});

export const deleteComment = asyncHandler(
    async (req: Request, res: Response) => {
        res.json({ message: 'Delete Comment' });
    }
);
