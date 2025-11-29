import { useRef } from 'react';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import type { ProfilePhotoSectionProps } from '@/screens/protected/settings/settings.types';

const ProfilePhotoSection = ({
    photoPreview,
    photo,
    onPhotoChange,
}: ProfilePhotoSectionProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Get file extension as fallback for HEIC detection
        const fileExtension = file.name.toLowerCase().split('.').pop() || '';

        // Validate file type - iOS can send empty MIME types or "application/octet-stream"
        const validTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/heic',
            'image/heif',
            'image/bmp',
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
        ];

        const isValidMimeType = file.type && validTypes.includes(file.type);
        const isValidExtension = validExtensions.includes(fileExtension);

        // Accept if type starts with 'image/' (catch-all for camera uploads)
        const isImageType = file.type && file.type.startsWith('image/');

        // iPhone/iOS may send empty MIME type - rely on extension
        const hasEmptyMimeType =
            !file.type ||
            file.type === '' ||
            file.type === 'application/octet-stream';
        const likelyIosImage = hasEmptyMimeType && isValidExtension;

        if (
            !isValidMimeType &&
            !isValidExtension &&
            !isImageType &&
            !likelyIosImage
        ) {
            console.error('Invalid file type detected:', file.type, fileExtension);
            toast.error(
                'Please select a valid image file (JPG, PNG, WebP or HEIC)'
            );
            return;
        }

        // Special handling for HEIC files (they often have empty or incorrect MIME type on iOS)
        if (
            fileExtension === 'heic' ||
            fileExtension === 'heif' ||
            (file.type &&
                (file.type.includes('heic') || file.type.includes('heif')))
        ) {
            console.log('HEIC file detected - Cloudinary will handle conversion');
            toast.info(
                'HEIC format detected. Cloudinary will optimize it automatically.'
            );
        }

        // Validate file size (max 10MB for iPhone photos which can be large)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            toast.error('Image size must be less than 10MB');
            return;
        }

        // Create preview URL (for display only)
        // Note: iOS may not display HEIC in preview, but upload will still work
        try {
            const previewUrl = URL.createObjectURL(file);
            onPhotoChange(file, previewUrl);
            toast.success('Photo selected successfully!');
        } catch (error) {
            console.error('Error creating preview:', error);
            toast.warning('Preview not available, but photo will be uploaded');
            // Still set the file even if preview fails (common with HEIC on some browsers)
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemovePhoto = () => {
        // Clean up object URL to prevent memory leaks
        if (photoPreview && photoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(photoPreview);
        }

        onPhotoChange(null, '');

        // Clear the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        toast.success('Photo removed');
    };

    return (
        <div className='flex justify-center w-full md:w-auto md:justify-start'>
            <div className='relative group'>
                <div
                    className='w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-blue-500 dark:border-blue-400 overflow-hidden shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200'
                    onClick={handlePhotoClick}>
                    {photoPreview || photo ? (
                        <img
                            src={photoPreview || photo}
                            alt='Profile'
                            className='w-full h-full object-cover'
                        />
                    ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                            <User className='w-12 h-12 text-gray-400 dark:text-gray-500' />
                        </div>
                    )}
                    {/* Overlay on hover */}
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full'>
                        <span className='text-white text-xs font-medium'>
                            Change Photo
                        </span>
                    </div>
                </div>

                {/* Add/Edit Photo Button */}
                <button
                    type='button'
                    onClick={handlePhotoClick}
                    className='absolute bottom-0 right-0 w-8 h-8 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800'
                    title='Change profile photo'>
                    <svg
                        className='w-4 h-4 text-white'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 4v16m8-8H4'
                        />
                    </svg>
                </button>

                {/* Remove Photo Button - Only show if there's a photo */}
                {(photoPreview || photo) && (
                    <button
                        type='button'
                        onClick={handleRemovePhoto}
                        className='absolute top-0 right-0 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800'
                        title='Remove profile photo'>
                        <svg
                            className='w-3 h-3 text-white'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M6 18L18 6M6 6l12 12'
                            />
                        </svg>
                    </button>
                )}

                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*,.heic,.heif'
                    onChange={handlePhotoSelect}
                    className='hidden'
                />
            </div>
        </div>
    );
};

export default ProfilePhotoSection;
