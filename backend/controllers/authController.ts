import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import Notification from '../models/notificationModel';
import Post from '../models/postModel';
import Workout from '../models/workoutModel';
import Nutrition from '../models/nutritionModel';
import Message from '../models/messageModel';
import CustomCategory from '../models/customCategoryModel';
import WorkoutTemplate from '../models/workoutTemplateModel';
import WorkoutTemplateFolder from '../models/workoutTemplateFolderModel';
import generateToken from '../utils/generateToken';
import { v2 as cloudinary } from 'cloudinary';

interface AuthUserBody {
    email: string;
    password: string;
}

// Request body interfaces for better type safety
interface RegisterUserBody {
    name: string;
    username: string;
    email: string;
    dob: Date;
    password: string;
    gender: string;
}

// Authenticate User
export const authUser = asyncHandler(
    async (
        req: Request<{}, {}, AuthUserBody>,
        res: Response
    ): Promise<void> => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id.toString());
            const authUser = await User.findById(user._id).select('-password');
            res.status(201).json(authUser);
        } else {
            res.status(400);
            throw new Error('Invalid E-mail or Password');
        }
    }
);

// Register New User
export const registerUser = asyncHandler(
    async (
        req: Request<{}, {}, RegisterUserBody>,
        res: Response
    ): Promise<void> => {
        const { name, username, email, dob, password, gender } = req.body;

        try {
            // Check if email is valid
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(400);
                throw new Error('Invalid email format');
            }

            // Check if password length is at least 8 characters
            if (password.length < 8) {
                res.status(400);
                throw new Error('Password must be at least 8 characters long');
            }

            const userExists = await User.findOne({ email });

            // Check if user with the same email already exists
            if (userExists) {
                res.status(400);
                throw new Error('User already exists');
            }

            // Check if username is already taken
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                res.status(400);
                throw new Error('Username already in use');
            }

            const user = await User.create({
                name,
                username,
                email,
                dob,
                password,
                gender,
            });

            if (user) {
                // Auto-follow xjohnfit profile
                try {
                    const ownerProfile = await User.findOne({
                        username: 'xjohnfit',
                    });
                    if (ownerProfile) {
                        // Add xjohnfit to the new user's following list
                        await User.findByIdAndUpdate(user._id, {
                            $push: { following: ownerProfile._id },
                        });
                        // Add new user to xjohnfit's followers list
                        await User.findByIdAndUpdate(ownerProfile._id, {
                            $push: { followers: user._id },
                        });

                        // Create notification for xjohnfit
                        const notification = new Notification({
                            type: 'follow',
                            from: user._id,
                            to: ownerProfile._id,
                            message: `${user.username} started following you.`,
                        });
                        await notification.save({ validateBeforeSave: false });
                    }
                } catch (followError) {
                    // Log error but don't fail registration if auto-follow fails
                    console.error('Auto-follow failed:', followError);
                }

                generateToken(res, user._id.toString());
                const newUser = await User.findById(user._id).select(
                    '-password'
                );
                res.status(201).json(newUser);
            } else {
                res.status(400);
                throw new Error('Invalid user data');
            }
        } catch (err: string | any) {
            res.status(500);
            throw new Error(err.message);
        }
    }
);

// Logout User
export const logoutUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        res.cookie('fit-verse-token', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ message: 'User logged out successfully' });
    }
);

// Delete User and all associated data
export const deleteUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const userId = req.user._id;

        try {
            // Find the user
            const user = await User.findById(userId);
            if (!user) {
                res.status(404);
                throw new Error('User not found');
            }

            // 1. Delete profile photo from Cloudinary if exists
            if (user.photo) {
                try {
                    // Extract public_id from the Cloudinary URL
                    const urlParts = user.photo.split('/');
                    const publicIdWithExtension = urlParts[urlParts.length - 1];
                    const publicId = publicIdWithExtension.split('.')[0];

                    // Delete from cloudinary (try common folders)
                    await cloudinary.uploader.destroy(`profile_photos/${publicId}`).catch(() => {
                        // If not in profile_photos folder, try root
                        return cloudinary.uploader.destroy(publicId);
                    });
                } catch (cloudinaryError) {
                    console.error('Error deleting photo from Cloudinary:', cloudinaryError);
                    // Continue with deletion even if cloudinary fails
                }
            }

            // 2. Delete all posts by the user and their images from Cloudinary
            const userPosts = await Post.find({ author: userId });
            for (const post of userPosts) {
                if (post.image) {
                    try {
                        const urlParts = post.image.split('/');
                        const publicIdWithExtension = urlParts[urlParts.length - 1];
                        const publicId = publicIdWithExtension.split('.')[0];
                        await cloudinary.uploader.destroy(`posts/${publicId}`).catch(() => {
                            return cloudinary.uploader.destroy(publicId);
                        });
                    } catch (error) {
                        console.error('Error deleting post image from Cloudinary:', error);
                    }
                }
            }
            await Post.deleteMany({ author: userId });

            // 3. Remove user from all posts' likes arrays
            await Post.updateMany(
                { likes: userId },
                { $pull: { likes: userId } }
            );

            // 4. Remove user from all posts' comments
            await Post.updateMany(
                { 'comments.user': userId },
                { $pull: { comments: { user: userId } } }
            );

            // 5. Remove user from followers/following lists
            await User.updateMany(
                { following: userId },
                { $pull: { following: userId } }
            );
            await User.updateMany(
                { followers: userId },
                { $pull: { followers: userId } }
            );

            // 6. Remove user from other users' likedPosts arrays
            await User.updateMany(
                { likedPosts: userId },
                { $pull: { likedPosts: userId } }
            );

            // 7. Delete all workouts
            await Workout.deleteMany({ user: userId });

            // 8. Delete all nutrition data
            await Nutrition.deleteMany({ user: userId });

            // 9. Delete all messages (sent and received)
            await Message.deleteMany({
                $or: [{ senderId: userId }, { receiverId: userId }]
            });

            // 10. Delete all notifications (sent and received)
            await Notification.deleteMany({
                $or: [{ from: userId }, { to: userId }]
            });

            // 11. Delete all custom categories
            await CustomCategory.deleteMany({ user: userId });

            // 12. Delete all workout templates
            await WorkoutTemplate.deleteMany({ userId: userId });

            // 13. Delete all workout template folders
            await WorkoutTemplateFolder.deleteMany({ userId: userId });

            // 14. Finally, delete the user account
            await User.findByIdAndDelete(userId);

            // Clear the authentication cookie
            res.cookie('fit-verse-token', '', {
                httpOnly: true,
                expires: new Date(0),
            });

            res.status(200).json({
                message: 'User and all associated data deleted successfully'
            });
        } catch (error: any) {
            console.error('Error deleting user:', error);
            res.status(500);
            throw new Error(error.message || 'Failed to delete user');
        }
    }
);


