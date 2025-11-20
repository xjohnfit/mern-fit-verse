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
    weightUnit: string;
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
        user.weightUnit = req.body.weightUnit || user.weightUnit;

        // Handle photo upload if base64 image is provided
        if (req.body.photo) {
            try {
                // Log upload details for debugging
                console.log('Processing image upload from base64 data');

                // Delete the previous photo from Cloudinary if it exists
                if (user.photo) {
                    const publicId = user.photo.split('/').pop()?.split('.')[0];
                    if (publicId) {
                        try {
                            await cloudinary.uploader.destroy(
                                `fit-verse/users/${publicId}`
                            );
                            console.log('Previous photo deleted successfully');
                        } catch (deleteError) {
                            console.warn(
                                'Failed to delete old photo, continuing with upload:',
                                deleteError
                            );
                        }
                    }
                }

                // Upload to Cloudinary - Cloudinary handles base64 data URI directly
                // Cloudinary natively supports HEIC and will automatically convert to browser-compatible formats
                const cloudinaryResult = await cloudinary.uploader.upload(
                    req.body.photo,
                    {
                        folder: 'fit-verse/users',
                        resource_type: 'auto', // Auto-detect the resource type
                        transformation: [
                            {
                                width: 800,
                                height: 800,
                                crop: 'limit',
                                quality: 'auto:good',
                                fetch_format: 'auto', // Automatically deliver the best format for the user's browser
                            },
                        ],
                    }
                );

                console.log(
                    'Photo upload successful:',
                    cloudinaryResult.secure_url
                );
                user.photo = cloudinaryResult.secure_url;
            } catch (uploadError: any) {
                console.error('Photo upload failed:', uploadError);
                console.error('Upload error details:', {
                    message: uploadError.message,
                    stack: uploadError.stack,
                    name: uploadError.name,
                });
                res.status(400);
                const errorMessage =
                    uploadError.message ||
                    'Failed to upload photo. Please try again.';
                throw new Error(errorMessage);
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

// Update nutrition goals
export const updateNutritionGoals = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const user = await User.findById(req.user!._id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const { calories, protein, carbs, fats } = req.body;

        // Validate that values are positive numbers if provided
        if (calories !== undefined && calories < 0) {
            res.status(400);
            throw new Error('Calories must be a positive number');
        }
        if (protein !== undefined && protein < 0) {
            res.status(400);
            throw new Error('Protein must be a positive number');
        }
        if (carbs !== undefined && carbs < 0) {
            res.status(400);
            throw new Error('Carbs must be a positive number');
        }
        if (fats !== undefined && fats < 0) {
            res.status(400);
            throw new Error('Fats must be a positive number');
        }

        // Update nutrition goals
        user.nutritionGoals = {
            calories:
                calories !== undefined
                    ? calories
                    : user.nutritionGoals?.calories,
            protein:
                protein !== undefined ? protein : user.nutritionGoals?.protein,
            carbs: carbs !== undefined ? carbs : user.nutritionGoals?.carbs,
            fats: fats !== undefined ? fats : user.nutritionGoals?.fats,
        };

        const updatedUser = await user.save();
        const userWithoutPassword = await User.findById(updatedUser._id).select(
            '-password'
        );

        res.status(200).json({
            success: true,
            message: 'Nutrition goals updated successfully',
            data: userWithoutPassword,
        });
    }
);

// Admin: Get all users
export const getAllUsers = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        // Check if user is admin
        if (!req.user!.admin) {
            res.status(403);
            throw new Error('Not authorized as admin');
        }

        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    }
);

// Admin: Update user role
export const updateUserRole = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        // Check if user is admin
        if (!req.user!.admin) {
            res.status(403);
            throw new Error('Not authorized as admin');
        }

        const { userId } = req.params;
        const { admin } = req.body;

        if (typeof admin !== 'boolean') {
            res.status(400);
            throw new Error('Admin field must be a boolean value');
        }

        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Prevent admin from removing their own admin status
        if (
            user._id.toString() === req.user!._id.toString() &&
            admin === false
        ) {
            res.status(400);
            throw new Error('You cannot remove your own admin privileges');
        }

        user.admin = admin;
        const updatedUser = await user.save();

        const userWithoutPassword = await User.findById(updatedUser._id).select(
            '-password'
        );

        res.status(200).json({
            success: true,
            message: `User ${
                admin ? 'promoted to' : 'demoted from'
            } admin successfully`,
            data: userWithoutPassword,
        });
    }
);
