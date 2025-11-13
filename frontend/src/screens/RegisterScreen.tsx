import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRegisterMutation } from '@/slices/usersApiSlice';
import { setCredentials } from '@/slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { ArrowRight, Eye, EyeOff, User, AtSign, Mail, Lock, Calendar, Users } from 'lucide-react';

const RegisterScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: '',
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string; }>({});

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

    const passwordStrength = getPasswordStrength(formData.password);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

    const { userInfo } = useSelector((state: any) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/dashboard');
        }
    }, [navigate, userInfo]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData((prev) => ({
                ...prev,
                [name]: target.checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

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
                if (!passwordValue) {
                    error = 'Password is required';
                } else if (passwordValue.length < 8) {
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
                break;

            case 'confirmPassword':
                const confirmPasswordValue = value as string;
                if (!confirmPasswordValue) {
                    error = 'Please confirm your password';
                } else if (confirmPasswordValue !== formData.password) {
                    error = 'Passwords do not match';
                }
                break;

            case 'dob':
                const dobValue = value as string;
                if (!dobValue) {
                    error = 'Date of birth is required';
                } else {
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

            case 'gender':
                if (!value) {
                    error = 'Gender is required';
                }
                break;

            default:
                break;
        }

        return error;
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string; } = {};
        const requiredFields = ['name', 'username', 'email', 'password', 'confirmPassword', 'dob', 'gender'];

        requiredFields.forEach(field => {
            const error = validateField(field, formData[field as keyof typeof formData]);
            if (error) {
                newErrors[field] = error;
            }
        });

        if (!formData.terms) {
            newErrors.terms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix all errors before submitting');
            return;
        }

        try {
            const { confirmPassword, terms, ...submitData } = formData;
            const res = await register(submitData).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success('Registration successful! Welcome to FitVerse!');
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className='min-h-screen relative overflow-hidden'>
            {/* Animated Background */}
            <div className='absolute inset-0 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20'>
                {/* Animated background elements */}
                <div className='absolute top-0 left-0 w-full h-full'>
                    <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse'></div>
                    <div className='absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-500'></div>
                </div>
            </div>

            {/* Main Content */}
            <div className='relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
                <div className='max-w-4xl w-full space-y-8'>
                    {/* Header */}
                    <div className='text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg'>
                            <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                            </svg>
                        </div>
                        <h1 className='text-4xl sm:text-5xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3'>
                            Join FitVerse
                        </h1>
                        <p className='text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto'>
                            Start your fitness transformation journey today and connect with like-minded individuals
                        </p>
                    </div>

                    {/* Registration Form */}
                    <div className='bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl dark:hover:shadow-blue-500/10 transition-all duration-500'>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            {/* Name & Username Row */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                {/* Name Field */}
                                <div className='space-y-2'>
                                    <label htmlFor='name' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                        Full Name
                                    </label>
                                    <div className='relative group'>
                                        <input
                                            id='name'
                                            name='name'
                                            type='text'
                                            value={formData.name}
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
                                    <label htmlFor='username' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                        Username
                                    </label>
                                    <div className='relative group'>
                                        <input
                                            id='username'
                                            name='username'
                                            type='text'
                                            required
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.username
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                    : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20'
                                                }`}
                                            placeholder='Choose a username'
                                        />
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <AtSign className='h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200' />
                                        </div>
                                    </div>
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
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.email
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                : 'border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-green-500/20'
                                            }`}
                                        placeholder='Enter your email address'
                                    />
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Mail className='h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200' />
                                    </div>
                                </div>
                                {errors.email && (
                                    <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                                        <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                        </svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Fields Row */}
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                {/* Password Field */}
                                <div className='space-y-2'>
                                    <label htmlFor='password' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                        Password
                                    </label>
                                    <div className='relative group'>
                                        <input
                                            id='password'
                                            name='password'
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-11 pr-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.password
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                    : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20'
                                                }`}
                                            placeholder='Create a password'
                                        />
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Lock className='h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200' />
                                        </div>
                                        <button
                                            type='button'
                                            onClick={() => setShowPassword(!showPassword)}
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                                        >
                                            {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                                        </button>
                                    </div>
                                    {/* Password Strength Indicator */}
                                    {formData.password && (
                                        <div className='mt-2'>
                                            <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1'>
                                                <span>Password Strength</span>
                                                <span className={`font-medium ${passwordStrength.score <= 2 ? 'text-red-500' :
                                                        passwordStrength.score === 3 ? 'text-yellow-500' : 'text-green-500'
                                                    }`}>
                                                    {passwordStrength.text}
                                                </span>
                                            </div>
                                            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5'>
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
                                </div>

                                {/* Confirm Password Field */}
                                <div className='space-y-2'>
                                    <label htmlFor='confirmPassword' className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                                        Confirm Password
                                    </label>
                                    <div className='relative group'>
                                        <input
                                            id='confirmPassword'
                                            name='confirmPassword'
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-11 pr-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.confirmPassword
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                    : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20'
                                                }`}
                                            placeholder='Confirm your password'
                                        />
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Lock className='h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200' />
                                        </div>
                                        <button
                                            type='button'
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                                        >
                                            {showConfirmPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                                        </button>
                                    </div>
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

                            {/* DOB & Gender Row */}
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
                                            required
                                            value={formData.dob}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.dob
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                    : 'border-gray-200 dark:border-gray-600 focus:border-pink-500 focus:ring-pink-500/20'
                                                }`}
                                        />
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Calendar className='h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors duration-200' />
                                        </div>
                                    </div>
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
                                            required
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.gender
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                                    : 'border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500/20'
                                                }`}
                                        >
                                            <option value=''>Select your gender</option>
                                            <option value='male'>Male</option>
                                            <option value='female'>Female</option>
                                            <option value='other'>Other</option>
                                            <option value='prefer-not-to-say'>Prefer not to say</option>
                                        </select>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Users className='h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-200' />
                                        </div>
                                    </div>
                                    {errors.gender && (
                                        <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                                            <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                            </svg>
                                            {errors.gender}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className='space-y-2'>
                                <div className='flex items-start space-x-3'>
                                    <div className='flex items-center h-5'>
                                        <input
                                            id='terms'
                                            name='terms'
                                            type='checkbox'
                                            checked={formData.terms}
                                            onChange={handleInputChange}
                                            className='w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 transition-colors duration-200'
                                        />
                                    </div>
                                    <div className='text-sm'>
                                        <label htmlFor='terms' className='text-gray-700 dark:text-gray-300'>
                                            I agree to the{' '}
                                            <a href='#' className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium'>
                                                Terms and Conditions
                                            </a>{' '}
                                            and{' '}
                                            <a href='#' className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium'>
                                                Privacy Policy
                                            </a>
                                        </label>
                                    </div>
                                </div>
                                {errors.terms && (
                                    <p className='mt-1 text-sm text-red-500 dark:text-red-400 flex items-center'>
                                        <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                        </svg>
                                        {errors.terms}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className='pt-4'>
                                <button
                                    type='submit'
                                    disabled={isLoading}
                                    className='w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2'
                                >
                                    {isLoading ? (
                                        <>
                                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <ArrowRight className='w-5 h-5' />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Login Link */}
                        <div className='mt-8 text-center'>
                            <p className='text-gray-600 dark:text-gray-400'>
                                Already have an account?{' '}
                                <a
                                    href='/login'
                                    className='text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold hover:underline transition-colors duration-200'
                                >
                                    Sign in here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;