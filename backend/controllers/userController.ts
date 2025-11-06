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
    dob: Date;
    password: string;
    gender: string;
}

interface AuthUserBody {
    email: string;
    password: string;
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

// Register New User
export const registerUser = asyncHandler(
    async (
        req: Request<{}, {}, RegisterUserBody>,
        res: Response
    ): Promise<void> => {
        const { name, username, email, dob, password, gender } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
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
            generateToken(res, user._id.toString());
            const newUser = await User.findById(user._id).select('-password');
            res.status(201).json(newUser);
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
);

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
        const user = req.user!;
        res.status(200).json(user);
    }
);

// Update user profile
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

        // Check if username or email is being updated to an existing one
        if (req.body.username && req.body.username !== user.username) {
            const usernameExists = await User.findOne({ username: req.body.username });
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
        user.photo = req.body.photo || user.photo;
        user.height = req.body.height || user.height;
        user.weight = req.body.weight || user.weight;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updateUser = await user.save();
        const updatedUser = await User.findById(updateUser._id).select('-password');
        res.status(200).json(updatedUser);
    }
);
