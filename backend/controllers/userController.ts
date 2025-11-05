import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import generateToken from '../utils/generateToken';

// Types import
import { IUser } from '../models/userModel';

// Custom request interface with user property
interface AuthenticatedRequest extends Request {
    user?: IUser;
}

// Request body interfaces for better type safety
interface RegisterUserBody {
    name: string;
    username: string;
    email: string;
    password: string;
    gender: string;
    goal: string;
    photo?: string;
}

interface AuthUserBody {
    email: string;
    password: string;
}

interface UpdateUserBody {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    gender?: string;
    goal?: string;
    photo?: string;
}

// Register New User
export const registerUser = asyncHandler(
    async (req: Request<{}, {}, RegisterUserBody>, res: Response): Promise<void> => {
        const { name, username, email, password, gender, goal, photo } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }
        const user = await User.create({
            name,
            username,
            email,
            password,
            gender,
            goal,
            photo,
        });
        if (user) {
            generateToken(res, user._id.toString());
            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                gender: user.gender,
                goal: user.goal,
                photo: user.photo,
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
);

// Authenticate User
export const authUser = asyncHandler(
    async (req: Request<{}, {}, AuthUserBody>, res: Response): Promise<void> => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id.toString());
            res.status(201).json({
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                gender: user.gender,
                goal: user.goal,
                photo: user.photo,
            });
        } else {
            res.status(400);
            throw new Error('Invalid email or password');
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

// Get user profile
export const getUserProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { _id, name, username, email, gender, goal, photo } = req.user!;
        res.status(200).json({
            _id,
            name,
            username,
            email,
            gender,
            goal,
            photo,
        });
    }
);

// Update user profile
export const updateUserProfile = asyncHandler(
    async (req: Request<{}, {}, UpdateUserBody> & AuthenticatedRequest, res: Response): Promise<void> => {
        const user = await User.findById(req.user!._id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.name = req.body.name || user.name;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.gender = req.body.gender || user.gender;
        user.goal = req.body.goal || user.goal;
        user.photo = req.body.photo || user.photo;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            gender: updatedUser.gender,
            goal: updatedUser.goal,
            photo: updatedUser.photo,
        });
    }
);