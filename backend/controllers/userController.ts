import type { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import asyncHandler from 'express-async-handler';

//Models import
import User from '../models/userModel';
import Notification from '../models/notificationModel';

// Types import
import { IUser } from '../models/userModel';

// Custom request interface with user property
interface AuthenticatedRequest extends Request {
    user?: IUser;
    file?: Express.Multer.File;
}
interface UpdateUserBody {
    name: string;
    username: string;
    email: string;
    dob: Date;
    password: string;
    gender: string;
    height: number;
    weight: number;
    goal: string;
    photo: string;
}

// Get logged-in user profile
export const getUserProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const user = await User.findById(req.user!._id)
            .select('-password')
            .populate('followers', 'name username photo')
            .populate('following', 'name username photo');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json(user);
    }
);

// Update logged-in user profile
export const updateUserProfile = asyncHandler(
    async (
        req: Request<{}, {}, UpdateUserBody> & AuthenticatedRequest,
        res: Response
    ): Promise<void> => {
        const user = await User.findById(req.user!._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.user!.email)) {
            res.status(400);
            throw new Error('Invalid email format');
        }

        // Check if username or email is being updated to an existing one
        if (req.body.username && req.body.username !== user.username) {
            const usernameExists = await User.findOne({
                username: req.body.username,
            });
            if (usernameExists) {
                res.status(400);
                throw new Error('Username already in use');
            }
        }

        user.name = req.body.name || user.name;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.dob = req.body.dob || user.dob;
        user.gender = req.body.gender || user.gender;
        user.goal = req.body.goal || user.goal;
        user.height = req.body.height || user.height;
        user.weight = req.body.weight || user.weight;

        // Handle file upload if present
        if (req.file) {
            try {
                if (user.photo) {
                    // Delete the previous photo from Cloudinary
                    const publicId = user.photo.split('/').pop()?.split('.')[0];
                    if (publicId) {
                        await cloudinary.uploader.destroy(publicId);
                    }
                }

                // Convert buffer to base64 and upload
                const b64 = Buffer.from(req.file.buffer).toString('base64');

                // Handle HEIC files - use a generic image mime type if HEIC/HEIF
                let mimeType = req.file.mimetype;
                const fileExtension =
                    req.file.originalname.toLowerCase().split('.').pop() || '';

                // For HEIC/HEIF files with incorrect mime types, use image/jpeg as fallback
                if (
                    (fileExtension === 'heic' || fileExtension === 'heif') &&
                    !mimeType.startsWith('image/')
                ) {
                    mimeType = 'image/jpeg';
                    console.log('HEIC file detected, using fallback mime type');
                }

                const dataURI = `data:${mimeType};base64,${b64}`;
                const cloudinaryResult = await cloudinary.uploader.upload(
                    dataURI,
                    {
                        resource_type: 'auto', // Let Cloudinary auto-detect the format
                        format: 'jpg', // Convert HEIC to JPG for better browser compatibility
                    }
                );

                console.log(
                    'Photo upload successful:',
                    cloudinaryResult.secure_url
                );
                user.photo = cloudinaryResult.secure_url;
            } catch (uploadError) {
                console.error('Photo upload failed:', uploadError);
                res.status(400);
                throw new Error(
                    'Failed to upload photo. Please try with a different image format.'
                );
            }
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updateUser = await user.save();
        const updatedUser = await User.findById(updateUser._id).select(
            '-password'
        );
        res.status(200).json(updatedUser);
    }
);

// View another user profile
export const viewUserProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const username = req.params.username;
        const user = await User.findOne({ username })
            .select('-password')
            .populate('followers', 'name username photo')
            .populate('following', 'name username photo');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        res.status(200).json(user);
    }
);

// Get suggested users to follow
export const getSuggestedUsers = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const currentUserId = req.user!._id;
        const currentUser = await User.findById(currentUserId);

        if (!currentUser) {
            res.status(404);
            throw new Error('User not found');
        }
        const following = currentUser.following;
        const suggestedUsers = await User.aggregate([
            { $match: { _id: { $ne: currentUserId, $nin: following } } },
            { $sample: { size: 10 } }, // Get 10 random users
            { $project: { password: 0, email: 0 } }, // Exclude sensitive fields
        ]);
        res.status(200).json(suggestedUsers);
    }
);

// Follow/Unfollow User
export const followUnfollowUser = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const targetUsername = req.params.username;
        const currentUserId = req.user!._id;

        const targetUser = await User.findOne({ username: targetUsername });
        const currentUser = await User.findById(currentUserId);

        if (targetUsername == req.user!.username) {
            res.status(400);
            throw new Error('You cannot follow/unfollow yourself');
        }

        if (!targetUser || !currentUser) {
            res.status(404);
            throw new Error('User not found');
        }

        try {
            const isFollowing = currentUser.following.includes(targetUser._id);

            if (isFollowing) {
                // Unfollow
                await User.findByIdAndUpdate(currentUser._id, {
                    $pull: { following: targetUser._id },
                });
                await User.findByIdAndUpdate(targetUser._id, {
                    $pull: { followers: currentUser._id },
                });
                res.status(200).json({
                    message: `Unfollowed ${targetUsername}`,
                });
            } else {
                // Follow
                await User.findByIdAndUpdate(currentUser._id, {
                    $push: { following: targetUser._id },
                });
                await User.findByIdAndUpdate(targetUser._id, {
                    $push: { followers: currentUser._id },
                });

                //send notification to the user
                const notification = new Notification({
                    type: 'follow',
                    from: currentUser._id,
                    to: targetUser._id,
                    message: `${currentUser.username} started following you.`,
                });
                await notification.save({ validateBeforeSave: false });

                // TODO: Integrate real-time notification via WebSocket
                // TODO: Integrate email notification if needed
                // TODO: Return the id/username of the user being followed/unfollowed
                res.status(200).json({ message: `Followed ${targetUsername}` });
            }
        } catch (error) {
            res.status(500);
            throw new Error('Server Error');
        }
    }
);
