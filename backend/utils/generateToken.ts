import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Response } from 'express';

// Generate a JWT and set it as an HTTP-only cookie
const generateToken = (res: Response, userId: string): void => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }

    const signOptions: SignOptions = { expiresIn: '30d' };
    const token = jwt.sign({ userId }, secret, signOptions);

    res.cookie('fit-verse-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    });
};

export default generateToken;