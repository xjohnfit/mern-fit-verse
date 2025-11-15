import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

// Models imports
import { PostModel } from '../models/postModel';
import Notification from '../models/notificationModel';
import User from '../models/userModel';

// Package imports
import { v2 as cloudinary } from 'cloudinary';

// Create a new post
export const createPost = asyncHandler(async (req: Request, res: Response) => {
    const { title, content } = req.body;
    let { image } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        res.status(401);
        throw new Error('User not authenticated');
    }

    if (!content && !image) {
        res.status(400);
        throw new Error('Post content or image is required');
    }

    if (image) {
        const uploadedImage = await cloudinary.uploader.upload(image);
        image = uploadedImage.secure_url;
    }

    const newPost = new PostModel({
        author: userId,
        title,
        content,
        image,
    });

    await newPost.save();
    res.status(201).json(newPost);
});

// Delete a post
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
    const post = await PostModel.findById(req.params.postId);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Check if the logged-in user is the author of the post
    if (post.author.toString() !== req.user?._id.toString()) {
        res.status(403);
        throw new Error('User not authorized to delete this post');
    }

    // If post has an image, delete it from Cloudinary as well
    if (post.image) {
        const publicId = post.image.split('/').pop()?.split('.')[0];
        if (publicId) {
            await cloudinary.uploader.destroy(publicId);
        }
    }

    await PostModel.findByIdAndDelete(req.params.postId);
    res.json({ message: 'Post deleted successfully' });
});

// Get posts for a specific user
export const getUserPosts = asyncHandler(
    async (req: Request, res: Response) => {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        const posts = await PostModel.find({ author: user._id })
            .populate('author', 'name username photo')
            .populate('comments.user', 'name username photo')
            .sort({ createdAt: -1 });

        // Transform the data to match frontend expectations
        const transformedPosts = posts.map((post) => ({
            ...post.toObject(),
            user: post.author, // Map author to user for frontend compatibility
        }));

        res.json(transformedPosts);
    }
);

// Get feed posts - returns all users posts and followed users posts
export const getFeedPosts = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        if (!userId) {
            res.status(401);
            throw new Error('User not authenticated');
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Get followed users IDs and include the current user's ID
        const followedUsers = user.following || [];
        const feedUserIds = [userId, ...followedUsers];

        // Get posts from current user and followed users
        const posts = await PostModel.find({ author: { $in: feedUserIds } })
            .populate('author', 'name username photo')
            .populate('comments.user', 'name username photo')
            .sort({ createdAt: -1 });

        // Transform the data to match frontend expectations
        const transformedPosts = posts.map((post) => ({
            ...post.toObject(),
            user: post.author, // Map author to user for frontend compatibility
        }));

        res.json(transformedPosts);
    }
);

// Get posts from followed users
export const getFollowedUsersPosts = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const followedUsers = user.following;
        const posts = await PostModel.find({ author: { $in: followedUsers } })
            .populate('author', 'name username photo')
            .populate('comments.user', 'name username photo')
            .sort({ createdAt: -1 });

        // Transform the data to match frontend expectations
        const transformedPosts = posts.map((post) => ({
            ...post.toObject(),
            user: post.author, // Map author to user for frontend compatibility
        }));

        res.json(transformedPosts);
    }
);

// Like or Unlike a post
export const likeUnlikePost = asyncHandler(
    async (req: Request, res: Response) => {
        const postId = req.params.postId;
        const userId = req.user?._id;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const post = await PostModel.findById(postId);
        if (!post) {
            res.status(404);
            throw new Error('Post not found');
        }

        const alreadyLiked = post.likes.includes(userId!);
        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (id) => id.toString() !== userId!.toString()
            );
            user.likedPosts = user.likedPosts?.filter(
                (id: string) => id.toString() !== postId.toString()
            );
        } else {
            post.likes.push(userId!);
            user.likedPosts?.push(postId);
        }

        await post.save();
        await user.save();

        // Only create notification if it's a like (not unlike) and not liking own post
        if (!alreadyLiked && post.author.toString() !== userId!.toString()) {
            const notification = new Notification({
                from: userId,
                to: post.author,
                type: 'like',
            });
            await notification.save();
        }

        res.status(200).json({
            message: alreadyLiked ? 'Post unliked' : 'Post liked',
            post: post,
        });
    }
);

// Add a comment to a post
export const addComment = asyncHandler(async (req: Request, res: Response) => {
    const { comment } = req.body;
    const postId = req.params.postId;
    const userId = req.user?._id;

    if (!comment) {
        res.status(400);
        throw new Error('Comment text is required');
    }

    const post = await PostModel.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const newComment = {
        user: userId,
        comment,
        createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
        message: 'Comment added successfully',
        comment: newComment,
    });
});

export const deleteComment = asyncHandler(
    async (req: Request, res: Response) => {
        res.json({ message: 'Delete Comment' });
    }
);
