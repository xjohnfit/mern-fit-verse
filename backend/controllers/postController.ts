import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

// Models imports
import Post from '../models/postModel';
import Notification from '../models/notificationModel';
import User from '../models/userModel';

// Package imports
import { v2 as cloudinary } from 'cloudinary';

// Create a new post
export const createPost = asyncHandler(async (req: Request, res: Response) => {
    const { content } = req.body;
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
        const uploadedImage = await cloudinary.uploader.upload(image, {
            folder: 'fit-verse/posts',
            resource_type: 'auto', // Let Cloudinary auto-detect the format
            format: 'jpg', // Convert HEIC to JPG for better browser compatibility
        });
        image = uploadedImage.secure_url;
    }

    const newPost = new Post({
        author: userId,
        content,
        image,
    });

    await newPost.save();
    res.status(201).json(newPost);
});

// Delete a post
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.postId);
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

    await Post.findByIdAndDelete(req.params.postId);
    res.json({ message: 'Post deleted successfully' });
});

// Get posts for a specific user
export const getUserPosts = asyncHandler(
    async (req: Request, res: Response) => {
        const { username } = req.params;
        const currentUserId = req.user?._id;

        const user = await User.findOne({ username });
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Check if there's a block relationship
        const currentUser = await User.findById(currentUserId);

        // Check if current user blocked target user or vice versa
        const isBlocked = currentUser?.blockedUsers?.some(
            (id: any) => id.toString() === user._id.toString()
        );
        const isBlockedBy = user.blockedUsers?.some(
            (id: any) => id.toString() === currentUserId?.toString()
        );

        // If blocked, return empty array
        if (isBlocked || isBlockedBy) {
            res.json([]);
            return;
        }

        const posts = await Post.find({ author: user._id })
            .populate('author', 'name username photo')
            .populate('comments.user', 'name username photo')
            .sort({ createdAt: -1 });

        // Get blocked users list for comment filtering
        const blockedUsers = currentUser?.blockedUsers || [];
        const usersWhoBlockedMe = await User.find({
            blockedUsers: currentUserId,
        }).select('_id');
        const blockedByIds = usersWhoBlockedMe.map((u) => u._id);
        const allBlockedIds = [...blockedUsers, ...blockedByIds];

        // Transform the data to match frontend expectations and filter comments
        const transformedPosts = posts.map((post) => {
            const postObj = post.toObject();
            // Filter out comments from blocked users
            const filteredComments = postObj.comments.filter((comment: any) => {
                const commentUserId = comment.user?._id?.toString();
                return !allBlockedIds.some(
                    (id: any) => id.toString() === commentUserId
                );
            });

            return {
                ...postObj,
                user: post.author, // Map author to user for frontend compatibility
                comments: filteredComments,
            };
        });

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

        // Get blocked users
        const blockedUsers = user.blockedUsers || [];

        // Get users who blocked the current user
        const usersWhoBlockedMe = await User.find({
            blockedUsers: userId,
        }).select('_id');
        const blockedByIds = usersWhoBlockedMe.map((u) => u._id);

        // Combine all blocked user IDs
        const allBlockedIds = [...blockedUsers, ...blockedByIds];

        // Get followed users IDs and include the current user's ID
        const followedUsers = user.following || [];
        const feedUserIds = [userId, ...followedUsers];

        // Get posts from current user and followed users, excluding blocked users
        const posts = await Post.find({
            author: { $in: feedUserIds, $nin: allBlockedIds },
        })
            .populate('author', 'name username photo')
            .populate('comments.user', 'name username photo')
            .sort({ createdAt: -1 });

        // Transform the data to match frontend expectations and filter comments
        const transformedPosts = posts.map((post) => {
            const postObj = post.toObject();
            // Filter out comments from blocked users
            const filteredComments = postObj.comments.filter((comment: any) => {
                const commentUserId = comment.user?._id?.toString();
                return !allBlockedIds.some(
                    (id: any) => id.toString() === commentUserId
                );
            });

            return {
                ...postObj,
                user: post.author, // Map author to user for frontend compatibility
                comments: filteredComments,
            };
        });

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

        // Get blocked users
        const blockedUsers = user.blockedUsers || [];

        // Get users who blocked the current user
        const usersWhoBlockedMe = await User.find({
            blockedUsers: userId,
        }).select('_id');
        const blockedByIds = usersWhoBlockedMe.map((u) => u._id);

        // Combine all blocked user IDs
        const allBlockedIds = [...blockedUsers, ...blockedByIds];

        const followedUsers = user.following;
        const posts = await Post.find({
            author: { $in: followedUsers, $nin: allBlockedIds },
        })
            .populate('author', 'name username photo')
            .populate('comments.user', 'name username photo')
            .sort({ createdAt: -1 });

        // Transform the data to match frontend expectations and filter comments
        const transformedPosts = posts.map((post) => {
            const postObj = post.toObject();
            // Filter out comments from blocked users
            const filteredComments = postObj.comments.filter((comment: any) => {
                const commentUserId = comment.user?._id?.toString();
                return !allBlockedIds.some(
                    (id: any) => id.toString() === commentUserId
                );
            });

            return {
                ...postObj,
                user: post.author, // Map author to user for frontend compatibility
                comments: filteredComments,
            };
        });

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

        const post = await Post.findById(postId);
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

    const post = await Post.findById(postId);
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
        const { postId, commentId } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401);
            throw new Error('User not authenticated');
        }

        const post = await Post.findById(postId);
        if (!post) {
            res.status(404);
            throw new Error('Post not found');
        }

        // Find the comment
        const comment = post.comments.find(
            (c: any) => c._id.toString() === commentId
        );

        if (!comment) {
            res.status(404);
            throw new Error('Comment not found');
        }

        // Check if the user is the comment author
        if (comment.user.toString() !== userId.toString()) {
            res.status(403);
            throw new Error('User not authorized to delete this comment');
        }

        // Remove the comment from the array
        post.comments = post.comments.filter(
            (c: any) => c._id.toString() !== commentId
        );

        await post.save();

        res.json({ message: 'Comment deleted successfully' });
    }
);
