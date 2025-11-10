import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { setCredentials } from '@/slices/authSlice';
import { useUpdateUserProfileMutation } from '@/slices/usersApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowRight, User, Target } from 'lucide-react';

//Utils functions imports
import { formatDateToInputValue } from '@/lib/formatDate';

const EditProfileScreen = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: '',
        photo: '',
        height: '',
        weight: '',
        goal: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string; }>({});
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>('');

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[@$!%*?&]/.test(password),
        };

        strength = Object.values(checks).filter(Boolean).length;

        if (strength === 0) return { score: 0, text: '', color: '' };
        if (strength <= 2) return { score: 1, text: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { score: 2, text: 'Fair', color: 'bg-yellow-500' };
        if (strength <= 4) return { score: 3, text: 'Good', color: 'bg-blue-500' };
        return { score: 4, text: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(profileData.password);

    // Photo handling functions
    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPG, PNG, or WebP)');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setPhotoFile(file);

        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setPhotoPreview(result);
            setProfileData(prev => ({
                ...prev,
                photo: result
            }));
        };
        reader.readAsDataURL(file);

        toast.success('Photo selected successfully!');
    };

    const handlePhotoClick = () => {
        const fileInput = document.getElementById('photo-input') as HTMLInputElement;
        fileInput?.click();
    };

    const handleRemovePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview('');
        setProfileData(prev => ({
            ...prev,
            photo: ''
        }));

        // Clear the file input
        const fileInput = document.getElementById('photo-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }

        toast.success('Photo removed');
    };

    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: any) => state.auth);

    const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

    useEffect(() => {
        if (userInfo) {
            setProfileData((prev) => ({
                ...prev,
                name: userInfo.name || '',
                username: userInfo.username || '',
                email: userInfo.email || '',
                dob: formatDateToInputValue(userInfo.dob) || '',
                gender: userInfo.gender || '',
                photo: userInfo.photo || '',
                height: userInfo.height || '',
                weight: userInfo.weight || '',
                goal: userInfo.goal || '',
            }));

            // Set initial photo preview from existing user photo
            if (userInfo.photo) {
                setPhotoPreview(userInfo.photo);
            }
        }
    }, [userInfo]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Real-time validation for better UX (only validate if field has value or already has error)
        if (value.trim() !== '' || errors[name]) {
            const error = validateField(name, value);
            setErrors((prev) => ({
                ...prev,
                [name]: error,
            }));
        }
    };

    const validateField = (name: string, value: any) => {
        let error = '';

        switch (name) {
            case 'name':
                const nameValue = value as string;
                if (!nameValue.trim()) {
                    error = 'Name is required';
                } else if (nameValue.trim().length < 2) {
                    error = 'Name must be at least 2 characters';
                } else if (nameValue.trim().length > 50) {
                    error = 'Name must be less than 50 characters';
                } else if (!/^[a-zA-Z\s]+$/.test(nameValue.trim())) {
                    error = 'Name can only contain letters and spaces';
                }
                break;

            case 'username':
                const usernameValue = value as string;
                if (!usernameValue.trim()) {
                    error = 'Username is required';
                } else if (usernameValue.length < 3) {
                    error = 'Username must be at least 3 characters';
                } else if (usernameValue.length > 20) {
                    error = 'Username must be less than 20 characters';
                } else if (!/^[a-zA-Z0-9_]+$/.test(usernameValue)) {
                    error = 'Username can only contain letters, numbers, and underscores';
                } else if (/^\d+$/.test(usernameValue)) {
                    error = 'Username cannot be only numbers';
                }
                break;

            case 'email':
                const emailValue = value as string;
                if (!emailValue.trim()) {
                    error = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                    error = 'Please enter a valid email address';
                } else if (emailValue.length > 254) {
                    error = 'Email address is too long';
                }
                break;

            case 'password':
                const passwordValue = value as string;
                if (passwordValue) { // Only validate if password is provided (it's optional for updates)
                    if (passwordValue.length < 8) {
                        error = 'Password must be at least 8 characters';
                    } else if (passwordValue.length > 128) {
                        error = 'Password must be less than 128 characters';
                    } else if (!/(?=.*[a-z])/.test(passwordValue)) {
                        error = 'Password must contain at least one lowercase letter';
                    } else if (!/(?=.*[A-Z])/.test(passwordValue)) {
                        error = 'Password must contain at least one uppercase letter';
                    } else if (!/(?=.*\d)/.test(passwordValue)) {
                        error = 'Password must contain at least one number';
                    } else if (!/(?=.*[@$!%*?&])/.test(passwordValue)) {
                        error = 'Password must contain at least one special character (@$!%*?&)';
                    } else if (/\s/.test(passwordValue)) {
                        error = 'Password cannot contain spaces';
                    }
                }
                break;

            case 'confirmPassword':
                const confirmPasswordValue = value as string;
                if (profileData.password && !confirmPasswordValue) {
                    error = 'Please confirm your password';
                } else if (confirmPasswordValue && confirmPasswordValue !== profileData.password) {
                    error = 'Passwords do not match';
                }
                break;

            case 'dob':
                const dobValue = value as string;
                if (dobValue) {
                    const today = new Date();
                    const birthDate = new Date(dobValue);
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();

                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }

                    if (birthDate >= today) {
                        error = 'Date of birth cannot be in the future';
                    } else if (age < 13) {
                        error = 'You must be at least 13 years old';
                    } else if (age > 120) {
                        error = 'Please enter a valid date of birth';
                    }
                }
                break;

            case 'height':
                const heightValue = Number(value);
                if (value && (heightValue < 50 || heightValue > 300)) {
                    error = 'Height must be between 50 and 300 cm';
                }
                break;

            case 'weight':
                const weightValue = Number(value);
                if (value && (weightValue < 20 || weightValue > 500)) {
                    error = 'Weight must be between 20 and 500 kg';
                }
                break;

            default:
                break;
        }

        return error;
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string; } = {};
        const requiredFields = ['name', 'username', 'email'];

        requiredFields.forEach(field => {
            const error = validateField(field, profileData[field as keyof typeof profileData]);
            if (error) {
                newErrors[field] = error;
            }
        });

        // Validate password if provided
        if (profileData.password) {
            const passwordError = validateField('password', profileData.password);
            if (passwordError) {
                newErrors.password = passwordError;
            }

            const confirmPasswordError = validateField('confirmPassword', profileData.confirmPassword);
            if (confirmPasswordError) {
                newErrors.confirmPassword = confirmPasswordError;
            }
        }

        // Validate optional fields if they have values
        ['dob', 'height', 'weight'].forEach(field => {
            const value = profileData[field as keyof typeof profileData];
            if (value) {
                const error = validateField(field, value);
                if (error) {
                    newErrors[field] = error;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        if (profileData.password && profileData.password !== profileData.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: 'Passwords do not match',
            }));
            toast.error('Passwords do not match');
            return;
        }

        try {
            const updateData: any = {
                _id: userInfo._id,
                name: profileData.name,
                username: profileData.username,
                email: profileData.email,
                dob: profileData.dob,
                gender: profileData.gender,
                goal: profileData.goal,
            };

            // Include photo if changed or set
            if (photoPreview || profileData.photo) {
                updateData.photo = photoPreview || profileData.photo;
            }

            // Only include password if it's provided
            if (profileData.password) {
                updateData.password = profileData.password;
            }

            // Only include height and weight if they have valid values
            if (profileData.height) {
                updateData.height = Number(profileData.height);
            }
            if (profileData.weight) {
                updateData.weight = Number(profileData.weight);
            }

            const res = await updateUserProfile(updateData).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success('Profile updated successfully');

            // Clear password fields and photo file state after successful update
            setProfileData(prev => ({
                ...prev,
                password: '',
                confirmPassword: '',
            }));

            // Clear photo file state but keep the photo URL in profileData
            setPhotoFile(null);

            // Clear the file input
            const fileInput = document.getElementById('photo-input') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
        } catch (err: string | any) {
            toast.error(err?.data?.message || err.message);
        }
    };

    return (
        <div className='min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12'>
            <div className='max-w-5xl w-full space-y-4 sm:space-y-6 lg:space-y-8'>
                {/* Header */}
                <div className='text-center space-y-1 sm:space-y-2'>
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent'>
                        Update Your Profile
                    </h1>
                    <p className='text-gray-400 text-sm sm:text-base lg:text-lg px-2'>
                        Keep your information up to date for the best experience
                    </p>
                </div>
                <div className='bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700 shadow-2xl hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-300'>

                    {/* Update Profile Form */}
                    <form
                        onSubmit={handleUpdate}
                        className='space-y-6 sm:space-y-7 lg:space-y-8'>
                        {/* Profile Picture & Goal Section */}
                        <div className='flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8 p-4 sm:p-5 lg:p-6 bg-gray-700/30 rounded-lg border border-gray-600'>
                            {/* Profile Picture */}
                            <div className='flex justify-center w-full md:w-auto md:justify-start'>
                                <div className='relative group'>
                                    <div className='w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full bg-gray-700 border-4 border-[#38bdf8] overflow-hidden shadow-[0_0_20px_rgba(56,189,248,0.3)] cursor-pointer transition-all duration-200 hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]' onClick={handlePhotoClick}>
                                        {photoPreview || profileData.photo ? (
                                            <img
                                                src={photoPreview || profileData.photo}
                                                alt='Profile'
                                                className='w-full h-full object-cover'
                                            />
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center'>
                                                <User className='w-12 h-12 text-gray-400' />
                                            </div>
                                        )}
                                        {/* Overlay on hover */}
                                        <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full'>
                                            <span className='text-white text-xs font-medium'>Change Photo</span>
                                        </div>
                                    </div>

                                    {/* Add/Edit Photo Button */}
                                    <button
                                        type='button'
                                        onClick={handlePhotoClick}
                                        className='absolute bottom-0 right-0 w-9 h-9 sm:w-8 sm:h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center border-2 border-gray-800 shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800'
                                        title='Change profile photo'
                                    >
                                        <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                                        </svg>
                                    </button>

                                    {/* Remove Photo Button - Only show if there's a photo */}
                                    {(photoPreview || profileData.photo) && (
                                        <button
                                            type='button'
                                            onClick={handleRemovePhoto}
                                            className='absolute top-0 right-0 w-7 h-7 sm:w-6 sm:h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center border-2 border-gray-800 shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-800'
                                            title='Remove profile photo'
                                        >
                                            <svg className='w-3 h-3 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                            </svg>
                                        </button>
                                    )}

                                    {/* Hidden File Input */}
                                    <input
                                        id='photo-input'
                                        type='file'
                                        accept='image/*'
                                        onChange={handlePhotoSelect}
                                        className='hidden'
                                    />
                                </div>
                            </div>

                            {/* Welcome & Goal Section */}
                            <div className='flex-1 w-full space-y-3 sm:space-y-4'>
                                {/* Welcome User Name */}
                                <div className='text-center md:text-left'>
                                    <h3 className='text-xl sm:text-2xl font-semibold text-white mb-1'>
                                        {userInfo?.name || 'User'}
                                    </h3>
                                    <p className='text-gray-400 text-sm sm:text-base px-2 md:px-0'>Keep your profile information current for the best fitness experience.</p>
                                </div>

                                {/* Goal Field */}
                                <div className='space-y-2'>
                                    <label
                                        htmlFor='goal'
                                        className='block text-sm font-medium text-cyan-400 mb-1'>
                                        Fitness Goal
                                    </label>
                                    <div className='relative'>
                                        <input
                                            id='goal'
                                            name='goal'
                                            type='text'
                                            maxLength={100}
                                            value={profileData.goal}
                                            onChange={handleInputChange}
                                            className='w-full px-4 py-3 sm:py-3.5 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400 text-base'
                                            placeholder='e.g., Lose 10kg, Build muscle, Run a marathon'
                                        />
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Target className='h-5 w-5 text-gray-400' />
                                        </div>
                                    </div>
                                    {profileData.goal && (
                                        <p className='mt-1 text-xs text-green-400'>
                                            ✓ Goal set - AI will personalize your fitness plan
                                        </p>
                                    )}
                                    {!profileData.goal && (
                                        <p className='text-xs text-gray-500'>
                                            Set a goal to help AI personalize your fitness journey
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Photo Upload Status */}
                            {photoFile && (
                                <div className='w-full mt-3 md:mt-4 md:w-auto md:ml-auto'>
                                    <div className='bg-green-500/10 border border-green-500/30 rounded-lg p-3'>
                                        <div className='flex items-center justify-center md:justify-start space-x-2'>
                                            <svg className='w-4 h-4 text-green-400 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                            </svg>
                                            <span className='text-green-400 text-sm font-medium'>New photo selected</span>
                                        </div>
                                        <p className='text-green-300 text-xs mt-1 text-center md:text-left truncate'>
                                            {photoFile.name} ({(photoFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Name & Username Row */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6'>
                            {/* Name Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='name'
                                    className='block text-sm sm:text-base font-medium text-blue-400 mb-1'>
                                    Full Name *
                                </label>
                                <div className='relative'>
                                    <input
                                        id='name'
                                        name='name'
                                        type='text'
                                        required
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 ${errors.name
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-blue-400 focus:ring-blue-400'
                                            }`}
                                        placeholder='Enter your full name'
                                    />
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <svg
                                            className='h-5 w-5 text-gray-400'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {!errors.name && profileData.name && profileData.name.length >= 2 && (
                                    <p className='mt-1 text-xs text-green-400'>
                                        ✓ Name looks good!
                                    </p>
                                )}
                                {errors.name && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Username Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='username'
                                    className='block text-sm font-medium text-purple-400 mb-1'>
                                    Username *
                                </label>
                                <div className='relative'>
                                    <input
                                        id='username'
                                        name='username'
                                        type='text'
                                        required
                                        autoComplete='username'
                                        value={profileData.username}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 ${errors.username
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-purple-400 focus:ring-purple-400'
                                            }`}
                                        placeholder='Choose a username'
                                    />
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <svg
                                            className='h-5 w-5 text-gray-400'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {!errors.username && profileData.username && profileData.username.length >= 3 && (
                                    <p className='mt-1 text-xs text-green-400'>
                                        ✓ Username looks good!
                                    </p>
                                )}
                                {errors.username && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.username}
                                    </p>
                                )}
                                {!profileData.username && (
                                    <p className='mt-1 text-xs text-gray-500'>
                                        3-20 characters, letters, numbers, and underscores only
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email & Gender Row */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6'>
                            {/* Email Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='email'
                                    className='block text-sm font-medium text-pink-400 mb-1'>
                                    Email Address *
                                </label>
                                <div className='relative'>
                                    <input
                                        id='email'
                                        name='email'
                                        type='email'
                                        required
                                        autoComplete='email'
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 ${errors.email
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-pink-400 focus:ring-pink-400'
                                            }`}
                                        placeholder='Enter your email'
                                    />
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <svg
                                            className='h-5 w-5 text-gray-400'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {!errors.email && profileData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email) && (
                                    <p className='mt-1 text-xs text-green-400'>
                                        ✓ Valid email address
                                    </p>
                                )}
                                {errors.email && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Gender Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='gender'
                                    className='block text-sm font-medium text-indigo-400 mb-1'>
                                    Gender
                                </label>
                                <select
                                    id='gender'
                                    name='gender'
                                    value={profileData.gender}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-1 focus:outline-none transition-all duration-200 border-gray-600 focus:border-indigo-400 focus:ring-indigo-400'
                                >
                                    <option value=''>Select Gender</option>
                                    <option value='male'>Male</option>
                                    <option value='female'>Female</option>
                                    <option value='other'>Other</option>
                                    <option value='prefer-not-to-say'>
                                        Prefer not to say
                                    </option>
                                </select>
                                {profileData.gender && (
                                    <p className='mt-1 text-xs text-green-400'>
                                        ✓ Gender selected
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Password & Confirm Password Row */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6'>
                            {/* Password Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='password'
                                    className='block text-sm font-medium text-emerald-400 mb-1'>
                                    Change Password <span className='text-xs text-gray-500'>(optional)</span>
                                </label>
                                <div className='relative'>
                                    <input
                                        id='password'
                                        name='password'
                                        autoComplete='new-password'
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={profileData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 ${errors.password
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-emerald-400 focus:ring-emerald-400'
                                            }`}
                                        placeholder='Enter new password (optional)'
                                    />
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <svg
                                            className='h-5 w-5 text-gray-400'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                                            />
                                        </svg>
                                    </div>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-400 transition-colors duration-200'>
                                        {showPassword ? (
                                            <svg
                                                className='h-5 w-5'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className='h-5 w-5'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                                />
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {/* Password Strength Indicator */}
                                {profileData.password && (
                                    <div className="mt-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-gray-400">Password Strength</span>
                                            <span className={`text-xs font-medium ${passwordStrength.score === 1 ? 'text-red-400' :
                                                passwordStrength.score === 2 ? 'text-yellow-400' :
                                                    passwordStrength.score === 3 ? 'text-blue-400' :
                                                        passwordStrength.score === 4 ? 'text-green-400' : 'text-gray-400'
                                                }`}>
                                                {passwordStrength.text}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-600 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                                {errors.password && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.password}
                                    </p>
                                )}
                                {!profileData.password && (
                                    <p className='mt-1 text-xs text-gray-500'>
                                        Leave blank to keep current password
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='confirmPassword'
                                    className='block text-sm font-medium text-teal-400 mb-1'>
                                    Confirm New Password
                                </label>
                                <div className='relative'>
                                    <input
                                        id='confirmPassword'
                                        name='confirmPassword'
                                        autoComplete='new-password'
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={profileData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 ${errors.confirmPassword
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-teal-400 focus:ring-teal-400'
                                            }`}
                                        placeholder='Confirm new password'
                                        disabled={!profileData.password}
                                    />
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <svg
                                            className='h-5 w-5 text-gray-400'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                            />
                                        </svg>
                                    </div>
                                    <button
                                        type='button'
                                        disabled={!profileData.password}
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-400 transition-colors duration-200 disabled:opacity-50'>
                                        {showConfirmPassword ? (
                                            <svg
                                                className='h-5 w-5'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className='h-5 w-5'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                                />
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {!errors.confirmPassword && profileData.confirmPassword && profileData.password === profileData.confirmPassword && (
                                    <p className='mt-1 text-xs text-green-400'>
                                        ✓ Passwords match
                                    </p>
                                )}
                                {errors.confirmPassword && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Date of Birth, Height & Weight Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6'>
                            {/* Date of Birth Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='dob'
                                    className='block text-sm font-medium text-violet-400 mb-1'>
                                    Date of Birth
                                </label>
                                <input
                                    id='dob'
                                    name='dob'
                                    type='date'
                                    value={profileData.dob}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-1 focus:outline-none transition-all duration-200 ${errors.dob
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-600 focus:border-violet-400 focus:ring-violet-400'
                                        }`}
                                />
                                {!errors.dob && profileData.dob && (
                                    <p className='mt-1 text-xs text-green-400'>
                                        ✓ Date selected
                                    </p>
                                )}
                                {errors.dob && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.dob}
                                    </p>
                                )}
                            </div>

                            {/* Height Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='height'
                                    className='block text-sm font-medium text-orange-400 mb-1'>
                                    Height (cm)
                                </label>
                                <div className='relative'>
                                    <input
                                        id='height'
                                        name='height'
                                        type='number'
                                        min='50'
                                        max='300'
                                        value={profileData.height}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 ${errors.height
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-orange-400 focus:ring-orange-400'
                                            }`}
                                        placeholder='e.g., 175'
                                    />
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <svg
                                            className='h-5 w-5 text-gray-400'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v6a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1V2m8 2v16l-4-2-4 2V4'
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {!errors.height && profileData.height && Number(profileData.height) >= 50 && Number(profileData.height) <= 300 && (
                                    <p className='mt-1 text-xs text-green-400'>
                                        ✓ Valid height
                                    </p>
                                )}
                                {errors.height && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.height}
                                    </p>
                                )}
                                {!profileData.height && (
                                    <p className='mt-1 text-xs text-gray-500'>
                                        50-300 cm range
                                    </p>
                                )}
                            </div>

                            {/* Weight Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='weight'
                                    className='block text-sm font-medium text-yellow-400 mb-1'>
                                    Weight (kg)
                                </label>
                                <div className='relative'>
                                    <input
                                        id='weight'
                                        name='weight'
                                        type='number'
                                        min='20'
                                        max='500'
                                        value={profileData.weight}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 ${errors.weight
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-yellow-400 focus:ring-yellow-400'
                                            }`}
                                        placeholder='e.g., 70'
                                    />
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <svg
                                            className='h-5 w-5 text-gray-400'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {!errors.weight && profileData.weight && Number(profileData.weight) >= 20 && Number(profileData.weight) <= 500 && (
                                    <p className='mt-1 text-xs text-green-400'>
                                        ✓ Valid weight
                                    </p>
                                )}
                                {errors.weight && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.weight}
                                    </p>
                                )}
                                {!profileData.weight && (
                                    <p className='mt-1 text-xs text-gray-500'>
                                        20-500 kg range
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Validation Summary */}
                        {Object.keys(errors).length > 0 && (
                            <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4'>
                                <h4 className='text-red-400 font-medium mb-2 flex items-center text-sm sm:text-base'>
                                    <svg className='w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
                                    </svg>
                                    Please fix the following errors:
                                </h4>
                                <ul className='text-xs sm:text-sm text-red-300 space-y-1'>
                                    {Object.entries(errors).map(([field, error]) => (
                                        <li key={field} className='flex items-start'>
                                            <span className='w-2 h-2 bg-red-400 rounded-full mr-2 mt-1.5 shrink-0'></span>
                                            <div className='min-w-0 flex-1'>
                                                <span className='capitalize font-medium'>{field.replace(/([A-Z])/g, ' $1')}:</span>
                                                <span className='ml-1 wrap-break-word'>{error}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className='pt-3 sm:pt-4'>
                            <button
                                disabled={isLoading || Object.keys(errors).length > 0}
                                type='submit'
                                className='w-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white 
                                py-3.5 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-sm sm:text-base
                                hover:from-blue-400 hover:via-purple-400 hover:to-pink-400
                                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
                                focus:ring-offset-gray-800 transform hover:scale-[1.02] active:scale-[0.98]
                                transition-all duration-200 
                                shadow-lg hover:shadow-xl
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                disabled:from-gray-500 disabled:via-gray-500 disabled:to-gray-500
                                min-h-12 sm:min-h-[52px]'>
                                {isLoading ? (
                                    <div className='flex items-center justify-center space-x-2 sm:space-x-3'>
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span className='text-sm sm:text-base'>Updating your profile...</span>
                                    </div>
                                ) : (
                                    <div className='flex items-center justify-center space-x-2'>
                                        <span>Update Profile</span>
                                        <ArrowRight className='h-4 w-4 sm:h-5 sm:w-5' />
                                    </div>
                                )}
                            </button>
                            <p className='text-xs sm:text-sm text-gray-500 text-center mt-2 sm:mt-3 px-4'>
                                Your information is secure and will only be used to improve your fitness experience
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfileScreen;
