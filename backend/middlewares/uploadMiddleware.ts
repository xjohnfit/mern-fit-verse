import multer from 'multer';
import { Request } from 'express';

// Configure multer for memory storage (we'll upload directly to Cloudinary)
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    // Get file extension
    const fileExtension =
        file.originalname.toLowerCase().split('.').pop() || '';

    // Check MIME type and file extension for better HEIC/HEIF support
    const validMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/heic',
        'image/heif',
    ];
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];

    const isValidMimeType =
        file.mimetype.startsWith('image/') ||
        validMimeTypes.includes(file.mimetype);
    const isValidExtension = validExtensions.includes(fileExtension);

    // Accept if either MIME type is valid OR extension is valid (for HEIC files with incorrect MIME types)
    if (isValidMimeType || isValidExtension) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

export default upload;
