import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

// Extend Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// Define the JWT payload interface
interface JwtPayload {
    userId: string;
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    token = req.cookies["fit-verse-token"];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, invalid token");
        }
    } else {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});