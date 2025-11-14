import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { setCredentials } from '@/slices/authSlice';
import { useUpdateUserProfileMutation } from '@/slices/usersApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowRight, User, Target, Mail, Lock, Calendar, Users, Eye, EyeOff, Monitor, Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';

//Utils functions imports
import { formatDateToInputValue } from '@/lib/formatDate';

// Theme Settings Component
const ThemeSettingsSection = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load saved preferences from localStorage
        const savedReducedMotion = localStorage.getItem('fitverse-reduced-motion');

        if (savedReducedMotion) {
            setReducedMotion(JSON.parse(savedReducedMotion));
            document.documentElement.style.setProperty('--animation-duration', JSON.parse(savedReducedMotion) ? '0s' : '0.3s');
        }
    }, []);

    const handleReducedMotionToggle = () => {
        const newValue = !reducedMotion;
        setReducedMotion(newValue);
        localStorage.setItem('fitverse-reduced-motion', JSON.stringify(newValue));
        document.documentElement.style.setProperty('--animation-duration', newValue ? '0s' : '0.3s');
        toast.success(`Animations ${newValue ? 'disabled' : 'enabled'}`);
    };

    if (!mounted) {
        return null;
    }

    const themeOptions = [
        { value: 'light', label: 'Light', icon: Sun, description: 'Clean and bright interface' },
        { value: 'dark', label: 'Dark', icon: Moon, description: 'Easy on the eyes in low light' },
        { value: 'system', label: 'System', icon: Monitor, description: 'Matches your device settings' }
    ];

    return (
        <div className='space-y-4'>
            <div className='flex items-center space-x-3 mb-6'>
                <div className='p-2 bg-linear-to-r from-purple-500 to-indigo-500 rounded-lg'>
                    <Palette className='w-5 h-5 text-white' />
                </div>
                <div>
                    <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100'>Theme Settings</h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Customize your visual experience</p>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                {themeOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = theme === option.value;

                    return (
                        <button
                            key={option.value}
                            type='button'
                            onClick={() => setTheme(option.value)}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left group hover:scale-105 ${isSelected
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                                : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                        >
                            <div className='flex items-center space-x-3'>
                                <div className={`p-2 rounded-lg transition-colors ${isSelected
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 group-hover:bg-gray-300 dark:group-hover:bg-gray-500'
                                    }`}>
                                    <IconComponent className='w-5 h-5' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <div className='flex items-center space-x-2'>
                                        <h4 className={`font-semibold ${isSelected
                                            ? 'text-blue-700 dark:text-blue-300'
                                            : 'text-gray-900 dark:text-gray-100'
                                            }`}>
                                            {option.label}
                                        </h4>
                                        {isSelected && (
                                            <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                        )}
                                    </div>
                                    <p className={`text-xs mt-1 ${isSelected
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {option.description}
                                    </p>
                                </div>
                            </div>

                            {/* Selection indicator */}
                            {isSelected && (
                                <div className='absolute top-2 right-2'>
                                    <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
                                        <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Accessibility Options */}
            <div className='mt-6 space-y-4'>
                <h4 className='text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2'>
                    <Users className='w-4 h-4' />
                    <span>Accessibility</span>
                </h4>
                <div className='p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600'>
                    <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                            <h5 className='font-medium text-gray-900 dark:text-gray-100'>Reduce Motion</h5>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                                Minimize animations and transitions for a calmer experience
                            </p>
                        </div>
                        <button
                            type='button'
                            onClick={handleReducedMotionToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 ${reducedMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reducedMotion ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Data Management Section */}
            <div className='mt-6 space-y-4'>
                <h4 className='text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2'>
                    <Lock className='w-4 h-4' />
                    <span>Data & Privacy</span>
                </h4>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <button
                        type='button'
                        onClick={() => {
                            localStorage.removeItem('fitverse-reduced-motion');
                            toast.success('Theme preferences reset successfully!');
                            window.location.reload();
                        }}
                        className='p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 text-left group hover:bg-orange-50 dark:hover:bg-orange-900/10'
                    >
                        <div className='flex items-center space-x-3'>
                            <div className='p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors'>
                                <svg className='w-4 h-4 text-orange-600 dark:text-orange-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                                </svg>
                            </div>
                            <div>
                                <h5 className='font-medium text-gray-900 dark:text-gray-100'>Reset Preferences</h5>
                                <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                                    Clear all saved theme settings
                                </p>
                            </div>
                        </div>
                    </button>

                    <button
                        type='button'
                        onClick={() => {
                            const themeData = {
                                theme,
                                reducedMotion,
                                exportedAt: new Date().toISOString()
                            };
                            const dataStr = JSON.stringify(themeData, null, 2);
                            const dataBlob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(dataBlob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'fitverse-theme-preferences.json';
                            link.click();
                            URL.revokeObjectURL(url);
                            toast.success('Theme preferences exported successfully!');
                        }}
                        className='p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 text-left group hover:bg-blue-50 dark:hover:bg-blue-900/10'
                    >
                        <div className='flex items-center space-x-3'>
                            <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors'>
                                <svg className='w-4 h-4 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                                </svg>
                            </div>
                            <div>
                                <h5 className='font-medium text-gray-900 dark:text-gray-100'>Export Settings</h5>
                                <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>
                                    Download your preferences
                                </p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Theme preview or additional info */}
            <div className='mt-4 p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-xl border border-blue-200/50 dark:border-blue-500/20'>
                <div className='flex items-start space-x-3'>
                    <div className='p-1 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg mt-1'>
                        <svg className='w-4 h-4 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                    </div>
                    <div>
                        <p className='text-sm font-medium text-blue-900 dark:text-blue-100'>
                            Current theme: <span className='capitalize'>{theme}</span>
                        </p>
                        <p className='text-xs text-blue-700 dark:text-blue-300 mt-1'>
                            All changes are saved automatically and synced across your devices.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsScreen = () => {
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

        // Get file extension as fallback for HEIC detection
        const fileExtension = file.name.toLowerCase().split('.').pop() || '';

        // Validate file type - include both MIME type and extension check
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];

        const isValidMimeType = validTypes.includes(file.type);
        const isValidExtension = validExtensions.includes(fileExtension);

        if (!isValidMimeType && !isValidExtension) {
            toast.error('Please select a valid image file (JPG, PNG, WebP or HEIC)');
            return;
        }

        // Special handling for HEIC files (they often have empty or incorrect MIME type)
        if (!isValidMimeType && (fileExtension === 'heic' || fileExtension === 'heif')) {
            console.log('HEIC file detected via extension');
            toast.info('HEIC file detected. It will be converted to JPG format for better compatibility.');
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setPhotoFile(file);

        // Create preview URL (for display only)
        const previewUrl = URL.createObjectURL(file);
        setPhotoPreview(previewUrl);

        toast.success('Photo selected successfully!');
    };

    const handlePhotoClick = () => {
        const fileInput = document.getElementById('photo-input') as HTMLInputElement;
        fileInput?.click();
    };

    const handleRemovePhoto = () => {
        // Clean up object URL to prevent memory leaks
        if (photoPreview && photoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(photoPreview);
        }

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

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            if (photoPreview && photoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

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
        const { name, value } = e.target;

        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Real-time validation - always validate when there's an error or when field has value
        // This ensures errors are cleared when user types valid input
        if (errors[name] || value.trim() !== '') {
            const error = validateField(name, value);
            if (error) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: error,
                }));
            } else {
                // Clear error if validation passes
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        } else if (errors[name] && value.trim() === '') {
            // Clear error when field is empty (for optional fields)
            const requiredFields = ['name', 'username', 'email'];
            if (!requiredFields.includes(name)) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        }



        // Special handling for password changes - also validate confirm password
        if (name === 'password') {
            // Re-validate confirm password if it has a value or error
            if (errors.confirmPassword || profileData.confirmPassword) {
                const confirmError = validateField('confirmPassword', profileData.confirmPassword, value);
                if (confirmError) {
                    setErrors((prev) => ({
                        ...prev,
                        confirmPassword: confirmError,
                    }));
                } else {
                    setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.confirmPassword;
                        return newErrors;
                    });
                }
            }
        }
    };

    const validateField = (name: string, value: any, currentPasswordValue?: string) => {
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
                const currentPassword = currentPasswordValue || profileData.password;
                if (currentPassword && !confirmPasswordValue) {
                    error = 'Please confirm your password';
                } else if (confirmPasswordValue && confirmPasswordValue !== currentPassword) {
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
            // Use FormData for file upload
            const formData = new FormData();
            formData.append('_id', userInfo._id);
            formData.append('name', profileData.name);
            formData.append('username', profileData.username);
            formData.append('email', profileData.email);
            formData.append('dob', profileData.dob);
            formData.append('gender', profileData.gender);
            formData.append('goal', profileData.goal);

            // Include photo file if selected
            if (photoFile) {
                formData.append('photo', photoFile);
            }

            // Only include password if it's provided
            if (profileData.password) {
                formData.append('password', profileData.password);
            }

            // Only include height and weight if they have valid values
            if (profileData.height) {
                formData.append('height', profileData.height);
            }
            if (profileData.weight) {
                formData.append('weight', profileData.weight);
            }

            const res = await updateUserProfile(formData).unwrap();
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
            console.error('Profile update error:', err);

            // Handle photo upload specific errors
            const errorMessage = err?.data?.message || err.message || 'An error occurred';

            if (errorMessage.toLowerCase().includes('photo') || errorMessage.toLowerCase().includes('upload')) {
                toast.error(`Photo upload failed: ${errorMessage}. Try converting HEIC to JPG or use a different image format.`);
            } else {
                toast.error(errorMessage);
            }
        }
    };

    return (
        <div className='min-h-screen relative overflow-hidden'>
            {/* Animated Background */}
            <div className='absolute inset-0 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20'>
                {/* Animated background elements */}
                <div className='absolute top-0 left-0 w-full h-full'>
                    <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse'></div>
                    <div className='absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-500'></div>
                </div>
            </div>

            {/* Main Content */}
            <div className='relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
                <div className='max-w-5xl w-full space-y-8'>
                    {/* Header */}
                    <div className='text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg'>
                            <User className='w-8 h-8 text-white' />
                        </div>
                        <h1 className='p-2 text-4xl sm:text-5xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3'>
                            Profile Settings
                        </h1>
                        <p className='text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto'>
                            Keep your information up to date for the best fitness experience
                        </p>
                    </div>

                    {/* Settings Form */}
                    <div className='bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl dark:hover:shadow-blue-500/10 transition-all duration-500'>

                        {/* Update Profile Form */}
                        <form
                            onSubmit={handleUpdate}
                            className='space-y-6 sm:space-y-7 lg:space-y-8'>
                            {/* Profile Picture & Goal Section */}
                            <div className='flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 p-6 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600'>
                                {/* Profile Picture */}
                                <div className='flex justify-center w-full md:w-auto md:justify-start'>
                                    <div className='relative group'>
                                        <div className='w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-blue-500 dark:border-blue-400 overflow-hidden shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200' onClick={handlePhotoClick}>
                                            {photoPreview || profileData.photo ? (
                                                <img
                                                    src={photoPreview || profileData.photo}
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
                                                <span className='text-white text-xs font-medium'>Change Photo</span>
                                            </div>
                                        </div>

                                        {/* Add/Edit Photo Button */}
                                        <button
                                            type='button'
                                            onClick={handlePhotoClick}
                                            className='absolute bottom-0 right-0 w-8 h-8 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800'
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
                                                className='absolute top-0 right-0 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800'
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
                                            accept='image/*,.heic,.heif'
                                            onChange={handlePhotoSelect}
                                            className='hidden'
                                        />
                                    </div>
                                </div>

                                {/* Welcome & Goal Section */}
                                <div className='flex-1 w-full space-y-4'>
                                    {/* Welcome User Name */}
                                    <div className='text-center md:text-left'>
                                        <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1'>
                                            Welcome, {userInfo?.name || 'User'}!
                                        </h3>
                                        <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base'>Keep your profile information current for the best fitness experience.</p>
                                    </div>

                                    {/* Goal Field */}
                                    <div className='space-y-2'>
                                        <label
                                            htmlFor='goal'
                                            className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                            Fitness Goal
                                        </label>
                                        <div className='relative group'>
                                            <input
                                                id='goal'
                                                name='goal'
                                                type='text'
                                                maxLength={100}
                                                value={profileData.goal}
                                                onChange={handleInputChange}
                                                className='w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20'
                                                placeholder='e.g., Lose 10kg, Build muscle, Run a marathon'
                                            />
                                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                <Target className='h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200' />
                                            </div>
                                        </div>
                                        {profileData.goal && (
                                            <p className='mt-1 text-xs text-green-600 dark:text-green-400 flex items-center'>
                                                <svg className='w-3 h-3 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                    <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                                </svg>
                                                Goal set - AI will personalize your fitness plan
                                            </p>
                                        )}
                                        {!profileData.goal && (
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                                Set a goal to help AI personalize your fitness journey
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Photo Upload Status */}
                                {photoFile && (
                                    <div className='w-full mt-4 md:w-auto md:ml-auto'>
                                        <div className='bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl p-3'>
                                            <div className='flex items-center justify-center md:justify-start space-x-2'>
                                                <svg className='w-4 h-4 text-green-600 dark:text-green-400 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                                </svg>
                                                <span className='text-green-700 dark:text-green-400 text-sm font-medium'>New photo selected</span>
                                            </div>
                                            <p className='text-green-600 dark:text-green-300 text-xs mt-1 text-center md:text-left truncate'>
                                                {photoFile.name} ({(photoFile.size / 1024 / 1024).toFixed(2)} MB)
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Name & Username Row */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                {/* Name Field */}
                                <div className='space-y-2'>
                                    <label
                                        htmlFor='name'
                                        className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                        Full Name
                                    </label>
                                    <div className='relative group'>
                                        <input
                                            id='name'
                                            name='name'
                                            type='text'
                                            required
                                            value={profileData.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.name
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                                                }`}
                                            placeholder='Enter your full name'
                                        />
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <User className='h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200' />
                                        </div>
                                    </div>
                                    {!errors.name && profileData.name && profileData.name.length >= 2 && (
                                        <p className='mt-2 text-sm text-green-600 dark:text-green-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                            </svg>
                                            Name looks good!
                                        </p>
                                    )}
                                    {errors.name && (
                                        <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                            </svg>
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Username Field */}
                                <div className='space-y-2'>
                                    <label
                                        htmlFor='username'
                                        className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                        Username
                                    </label>
                                    <div className='relative group'>
                                        <input
                                            id='username'
                                            name='username'
                                            type='text'
                                            required
                                            autoComplete='username'
                                            value={profileData.username}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.username
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20'
                                                }`}
                                            placeholder='Choose a username'
                                        />
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <svg className='h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                            </svg>
                                        </div>
                                    </div>
                                    {!errors.username && profileData.username && profileData.username.length >= 3 && (
                                        <p className='mt-2 text-sm text-green-600 dark:text-green-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                            </svg>
                                            Username looks good!
                                        </p>
                                    )}
                                    {errors.username && (
                                        <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                            </svg>
                                            {errors.username}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className='space-y-2'>
                                <label htmlFor='email' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                    Email Address
                                </label>
                                <div className='relative group'>
                                    <input
                                        id='email'
                                        name='email'
                                        type='email'
                                        required
                                        autoComplete='email'
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.email
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                                            }`}
                                        placeholder='Enter your email address'
                                    />
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Mail className='h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200' />
                                    </div>
                                </div>
                                {!errors.email && profileData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email) && (
                                    <p className='mt-2 text-sm text-green-600 dark:text-green-400 flex items-center'>
                                        <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                        </svg>
                                        Valid email address
                                    </p>
                                )}
                                {errors.email && (
                                    <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                                        <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                        </svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Date of Birth & Gender Row */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                {/* Date of Birth Field */}
                                <div className='space-y-2'>
                                    <label htmlFor='dob' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                        Date of Birth
                                    </label>
                                    <div className='relative group'>
                                        <input
                                            id='dob'
                                            name='dob'
                                            type='date'
                                            value={profileData.dob}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.dob
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20'
                                                }`}
                                        />
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Calendar className='h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200' />
                                        </div>
                                    </div>
                                    {!errors.dob && profileData.dob && (
                                        <p className='mt-2 text-sm text-green-600 dark:text-green-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                            </svg>
                                            Date selected
                                        </p>
                                    )}
                                    {errors.dob && (
                                        <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                            </svg>
                                            {errors.dob}
                                        </p>
                                    )}
                                </div>

                                {/* Gender Field */}
                                <div className='space-y-2'>
                                    <label htmlFor='gender' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                        Gender
                                    </label>
                                    <div className='relative group'>
                                        <select
                                            id='gender'
                                            name='gender'
                                            value={profileData.gender}
                                            onChange={handleInputChange}
                                            className='w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20'
                                        >
                                            <option value=''>Select Gender</option>
                                            <option value='male'>Male</option>
                                            <option value='female'>Female</option>
                                            <option value='other'>Other</option>
                                            <option value='prefer-not-to-say'>Prefer not to say</option>
                                        </select>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Users className='h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200' />
                                        </div>
                                    </div>
                                    {profileData.gender && (
                                        <p className='mt-2 text-sm text-green-600 dark:text-green-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                            </svg>
                                            Gender selected
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Password & Confirm Password Row */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                {/* Password Field */}
                                <div className='space-y-2'>
                                    <label htmlFor='password' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                        Change Password <span className='text-xs text-gray-500 dark:text-gray-400'>(optional)</span>
                                    </label>
                                    <div className='relative group'>
                                        <input
                                            id='password'
                                            name='password'
                                            autoComplete='new-password'
                                            type={showPassword ? 'text' : 'password'}
                                            value={profileData.password}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-11 pr-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.password
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-green-500/20'
                                                }`}
                                            placeholder='Enter new password (optional)'
                                        />
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Lock className='h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200' />
                                        </div>
                                        <button
                                            type='button'
                                            onClick={() => setShowPassword(!showPassword)}
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-500 transition-colors duration-200'
                                        >
                                            {showPassword ? (
                                                <EyeOff className='h-5 w-5' />
                                            ) : (
                                                <Eye className='h-5 w-5' />
                                            )}
                                        </button>
                                    </div>
                                    {/* Password Strength Indicator */}
                                    {profileData.password && (
                                        <div className="mt-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength</span>
                                                <span className={`text-xs font-medium ${passwordStrength.score === 1 ? 'text-red-500 dark:text-red-400' :
                                                    passwordStrength.score === 2 ? 'text-yellow-500 dark:text-yellow-400' :
                                                        passwordStrength.score === 3 ? 'text-blue-500 dark:text-blue-400' :
                                                            passwordStrength.score === 4 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    {passwordStrength.text}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                    {errors.password && (
                                        <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                            </svg>
                                            {errors.password}
                                        </p>
                                    )}
                                    {!profileData.password && (
                                        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                                            Leave blank to keep current password
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className='space-y-2'>
                                    <label htmlFor='confirmPassword' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                        Confirm New Password
                                    </label>
                                    <div className='relative group'>
                                        <input
                                            id='confirmPassword'
                                            name='confirmPassword'
                                            autoComplete='new-password'
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={profileData.confirmPassword}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-11 pr-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.confirmPassword
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500/20'
                                                } ${!profileData.password ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            placeholder='Confirm new password'
                                            disabled={!profileData.password}
                                        />
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Lock className='h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-200' />
                                        </div>
                                        <button
                                            type='button'
                                            disabled={!profileData.password}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-500 transition-colors duration-200 disabled:opacity-50'
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className='h-5 w-5' />
                                            ) : (
                                                <Eye className='h-5 w-5' />
                                            )}
                                        </button>
                                    </div>
                                    {!errors.confirmPassword && profileData.confirmPassword && profileData.password === profileData.confirmPassword && (
                                        <p className='mt-2 text-sm text-green-600 dark:text-green-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                            </svg>
                                            Passwords match
                                        </p>
                                    )}
                                    {errors.confirmPassword && (
                                        <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                            </svg>
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Height & Weight Row */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                {/* Height Field */}
                                <div className='space-y-2'>
                                    <label htmlFor='height' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                        Height (cm)
                                    </label>
                                    <div className='relative group'>
                                        <input
                                            id='height'
                                            name='height'
                                            type='number'
                                            min='50'
                                            max='300'
                                            value={profileData.height}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.height
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500/20'
                                                }`}
                                            placeholder='e.g., 175'
                                        />
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <svg className='h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v6a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1V2m8 2v16l-4-2-4 2V4' />
                                            </svg>
                                        </div>
                                    </div>
                                    {!errors.height && profileData.height && Number(profileData.height) >= 50 && Number(profileData.height) <= 300 && (
                                        <p className='mt-2 text-sm text-green-600 dark:text-green-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                            </svg>
                                            Valid height
                                        </p>
                                    )}
                                    {errors.height && (
                                        <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                            </svg>
                                            {errors.height}
                                        </p>
                                    )}
                                </div>

                                {/* Weight Field */}
                                <div className='space-y-2'>
                                    <label htmlFor='weight' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                        Weight (kg)
                                    </label>
                                    <div className='relative group'>
                                        <input
                                            id='weight'
                                            name='weight'
                                            type='number'
                                            min='20'
                                            max='500'
                                            value={profileData.weight}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.weight
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-gray-600 focus:border-yellow-500 focus:ring-yellow-500/20'
                                                }`}
                                            placeholder='e.g., 70'
                                        />
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <svg className='h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' />
                                            </svg>
                                        </div>
                                    </div>
                                    {!errors.weight && profileData.weight && Number(profileData.weight) >= 20 && Number(profileData.weight) <= 500 && (
                                        <p className='mt-2 text-sm text-green-600 dark:text-green-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                            </svg>
                                            Valid weight
                                        </p>
                                    )}
                                    {errors.weight && (
                                        <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                            </svg>
                                            {errors.weight}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Theme Settings Section */}
                            <ThemeSettingsSection />

                            {/* Validation Summary */}
                            {Object.values(errors).some(error => error && error.trim() !== '') && (
                                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl p-4'>
                                    <h4 className='text-red-700 dark:text-red-400 font-medium mb-3 flex items-center'>
                                        <svg className='w-5 h-5 mr-2 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
                                        </svg>
                                        Please fix the following errors:
                                    </h4>
                                    <ul className='text-sm text-red-600 dark:text-red-300 space-y-2'>
                                        {Object.entries(errors)
                                            .filter(([_, error]) => error && error.trim() !== '')
                                            .map(([field, error]) => (
                                                <li key={field} className='flex items-start'>
                                                    <span className='w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full mr-3 mt-2 shrink-0'></span>
                                                    <div className='min-w-0 flex-1'>
                                                        <span className='capitalize font-medium'>{field.replace(/([A-Z])/g, ' $1')}:</span>
                                                        <span className='ml-1'>{error}</span>
                                                    </div>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className='pt-6'>
                                <button
                                    disabled={
                                        isLoading ||
                                        Object.values(errors).some(error => error && error.trim() !== '') ||
                                        !profileData.name.trim() ||
                                        !profileData.username.trim() ||
                                        !profileData.email.trim()
                                    }
                                    type='submit'
                                    className='w-full group relative overflow-hidden bg-linear-to-r from-blue-500 via-purple-500 to-indigo-500 text-white py-4 px-6 rounded-xl font-semibold text-base hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 min-h-14'
                                >
                                    {isLoading ? (
                                        <div className='flex items-center justify-center space-x-3'>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Updating your profile...</span>
                                        </div>
                                    ) : (
                                        <div className='flex items-center justify-center space-x-2'>
                                            <span>Update Profile</span>
                                            <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform duration-200' />
                                        </div>
                                    )}
                                </button>
                                <p className='text-sm text-gray-500 dark:text-gray-400 text-center mt-3'>
                                    Your information is secure and will only be used to improve your fitness experience
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
