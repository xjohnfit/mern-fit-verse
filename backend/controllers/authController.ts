import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel';
import generateToken from '../utils/generateToken';

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
                generateToken(res, user._id.toString());
                const newUser = await User.findById(user._id).select('-password');
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