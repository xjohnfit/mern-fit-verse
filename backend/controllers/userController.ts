import type { Request, Response} from 'express'
import asyncHandler from 'express-async-handler'

// Register New User
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    // const { username, email, password } = req.body;
    console.log('User register route')
});