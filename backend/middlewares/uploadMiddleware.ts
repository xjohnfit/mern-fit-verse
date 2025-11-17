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
    console.log('Multer file filter - checking file:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
    });

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
        'application/octet-stream', // iOS sometimes sends this
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

    // Also accept files with no MIME type if they have valid extension (iOS issue)
    const hasValidExtension = validExtensions.includes(fileExtension);

    if (isValidMimeType || isValidExtension || hasValidExtension) {
        console.log('File accepted by multer');
        cb(null, true);
    } else {
        console.error('File rejected by multer:', {
            mimetype: file.mimetype,
            extension: fileExtension,
        });
        cb(
            new Error(
                `Invalid file type. Only image files are allowed. Received MIME: ${file.mimetype}, Extension: ${fileExtension}`
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
