import type { Request, Response} from 'express'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel';
import generateToken from '../utils/generateToken';

// Register New User
export const registerUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { name, username, email, password, goal, photo } = req.body;
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
                goal: user.goal,
                photo: user.photo,
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
);