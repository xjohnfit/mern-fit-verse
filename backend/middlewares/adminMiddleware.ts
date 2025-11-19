import type { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/userModel';

// Custom request interface with user property
interface AuthenticatedRequest extends Request {
    user?: IUser;
}

// Middleware to check if user is admin
export const admin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    if (req.user && req.user.admin) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as admin');
    }
};
