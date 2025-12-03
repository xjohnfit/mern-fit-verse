import { Request, Response, NextFunction } from 'express';

interface Error {
    kind: string;
    name: string;
    message: string;
    stack?: string;
    statusCode?: number;
}

const notFound = (req: Request, res: Response, next: NextFunction) => {
    // Check if it's an API request
    if (req.originalUrl.startsWith('/api/')) {
        const error = new Error(`API endpoint not found: ${req.originalUrl}`);
        res.status(404);
        next(error);
    } else {
        // Non-API routes (e.g., trying to access root or other pages)
        const error = new Error(`Route not found: ${req.originalUrl}`);
        res.status(404);
        next(error);
    }
};

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
    let errorType = 'Error';

    // Handle specific error types
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found - Invalid ID format';
        errorType = 'CastError';
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        errorType = 'ValidationError';
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token - Authentication failed';
        errorType = 'AuthenticationError';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired - Please login again';
        errorType = 'AuthenticationError';
    } else if (err.name === 'MongoServerError' || err.name === 'MongoError') {
        statusCode = 500;
        message = 'Database error occurred';
        errorType = 'DatabaseError';
    }

    // Build response
    const response: any = {
        success: false,
        error: errorType,
        message,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
    };

    // Include stack trace only in development
    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    // Log error in production for monitoring
    if (process.env.NODE_ENV === 'production') {
        console.error({
            statusCode,
            error: errorType,
            message,
            path: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString(),
        });
    }

    res.status(statusCode).json(response);
};

export { notFound, errorHandler };
