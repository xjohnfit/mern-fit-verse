import multer from 'multer';
import { Request } from 'express';

// Configure multer for memory storage (we'll upload directly to Cloudinary)
const storage = multer.memoryStorage();

// File filter to allow various image formats
// Cloudinary natively supports HEIC/HEIF and will automatically convert them
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    // Get file extension
    const fileExtension =
        file.originalname.toLowerCase().split('.').pop() || '';

    // Supported image formats (Cloudinary handles HEIC natively)
    const validMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/heic',
        'image/heif',
        'image/bmp',
        'image/tiff',
    ];

    const validExtensions = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'heic',
        'heif',
        'bmp',
        'tiff',
        'tif',
    ];

    // Accept any file that starts with 'image/' or has a valid image extension
    // This is flexible for HEIC files which may have incorrect/missing MIME types
    const isValidMimeType =
        file.mimetype.startsWith('image/') ||
        validMimeTypes.includes(file.mimetype);
    const isValidExtension = validExtensions.includes(fileExtension);

    if (isValidMimeType || isValidExtension) {
        cb(null, true);
    } else {
        cb(
            new Error(
                `Invalid file type. Only image files are allowed. Received: ${file.mimetype}`
            )
        );
    }
};

// Configure multer with increased size limit for high-quality images
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit (HEIC files can be larger)
    },
});

export default upload;
