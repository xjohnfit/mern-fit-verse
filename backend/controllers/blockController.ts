import { Request, Response } from 'express';
import User from '../models/userModel';

// @desc    Block a user
// @route   POST /api/users/block/:userId
// @access  Private
export const blockUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        // Validate not blocking yourself
        if (userId === currentUserId.toString()) {
            res.status(400);
            throw new Error('You cannot block yourself');
        }

        // Check if user to block exists
        const userToBlock = await User.findById(userId);
        if (!userToBlock) {
            res.status(404);
            throw new Error('User not found');
        }

        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            res.status(404);
            throw new Error('Current user not found');
        }

        // Check if already blocked
        if (currentUser.blockedUsers?.some((id) => id.toString() === userId)) {
            res.status(400);
            throw new Error('User is already blocked');
        }

        // Add to blocked users array
        currentUser.blockedUsers = currentUser.blockedUsers || [];
        currentUser.blockedUsers.push(userId as any);

        // Remove any existing follows between users
        currentUser.following = currentUser.following?.filter(
            (id) => id.toString() !== userId
        );

        userToBlock.followers = userToBlock.followers?.filter(
            (id) => id.toString() !== currentUserId.toString()
        );

        await currentUser.save();
        await userToBlock.save();

        res.json({
            message: `${userToBlock.name} has been blocked`,
            blockedUserId: userId,
        });
    } catch (error: any) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message || 'Error blocking user',
        });
    }
};

// @desc    Unblock a user
// @route   DELETE /api/users/block/:userId
// @access  Private
export const unblockUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            res.status(404);
            throw new Error('User not found');
        }

        // Check if user is actually blocked
        if (!currentUser.blockedUsers?.some((id) => id.toString() === userId)) {
            res.status(400);
            throw new Error('User is not blocked');
        }

        // Remove from blocked users array
        currentUser.blockedUsers = currentUser.blockedUsers?.filter(
            (id) => id.toString() !== userId
        );

        await currentUser.save();

        const unblockedUser = await User.findById(userId);

        res.json({
            message: `${unblockedUser?.name || 'User'} has been unblocked`,
            unblockedUserId: userId,
        });
    } catch (error: any) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
            message: error.message || 'Error unblocking user',
        });
    }
};

// @desc    Get blocked users list
// @route   GET /api/users/blocked
// @access  Private
export const getBlockedUsers = async (req: Request, res: Response) => {
    try {
        const currentUserId = req.user._id;

        const user = await User.findById(currentUserId).populate(
            'blockedUsers',
            'name username photo'
        );

        res.json({ blockedUsers: user?.blockedUsers || [] });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || 'Error fetching blocked users',
        });
    }
};

// @desc    Check if user is blocked
// @route   GET /api/users/block-status/:userId
// @access  Private
export const checkIfBlocked = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const currentUser = await User.findById(currentUserId);
        const isBlocked =
            currentUser?.blockedUsers?.some((id) => id.toString() === userId) ||
            false;

        // Also check if they blocked you
        const otherUser = await User.findById(userId);
        const blockedByThem =
            otherUser?.blockedUsers?.some(
                (id) => id.toString() === currentUserId.toString()
            ) || false;

        res.json({
            isBlocked,
            blockedByThem,
            canInteract: !isBlocked && !blockedByThem,
        });
    } catch (error: any) {
        res.status(500).json({
            message: error.message || 'Error checking block status',
        });
    }
};
