import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRegisterMutation } from '@/slices/usersApiSlice';
import { setCredentials } from '@/slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';


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

    const { isAuthenticated } = useSelector((state: any) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        const fieldValue = type === 'checkbox' ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));

        // Real-time validation for better UX
        if ((type !== 'checkbox' && value.trim() !== '') || type === 'checkbox' || errors[name]) {
            const error = validateField(name, fieldValue);
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
                const genderValue = value as string;
                if (!genderValue) {
                    error = 'Please select your gender';
                }
                break;

            case 'terms':
                const termsValue = value as boolean;
                if (!termsValue) {
                    error = 'You must agree to the Terms of Service and Privacy Policy';
                }
                break;

            default:
                break;
        }

        return error;
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string; } = {};
        const fields = ['name', 'username', 'email', 'password', 'confirmPassword', 'dob', 'gender', 'terms'];

        fields.forEach(field => {
            const error = validateField(field, formData[field as keyof typeof formData]);
            if (error) {
                newErrors[field] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            if (formData.password === formData.confirmPassword) {
                try {
                    const res = await register(formData).unwrap();
                    dispatch(setCredentials({ ...res }));
                    toast.success('Registration Successful.');
                    navigate('/dashboard');
                } catch (err: string | any) {
                    toast.error(err?.data.message);
                }
            } else {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: 'Passwords do not match',
                }));
                toast.error('Passwords do not match');
            }
        }
    };

    return (
        <div className='min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
            <div className='max-w-4xl w-full space-y-6'>
                {/* Header */}
                <div className='text-center'>
                    <h1 className='text-4xl font-bold bg-linear-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent mb-2'>
                        Join FitVerse
                    </h1>
                    <p className='text-gray-400 text-lg'>
                        Create your fitness journey today
                    </p>
                </div>

                {/* Registration Form */}
                <div className='bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-300'>
                    <form
                        onSubmit={handleSubmit}
                        className='space-y-5'>
                        {/* Name & Username Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {/* Name Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='name'
                                    className='block text-sm font-medium text-blue-400 mb-1'>
                                    Full Name
                                </label>
                                <div className='relative'>
                                    <input
                                        id='name'
                                        name='name'
                                        type='text'
                                        value={formData.name}
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
                                    Username
                                </label>
                                <div className='relative'>
                                    <input
                                        id='username'
                                        name='username'
                                        type='text'
                                        required
                                        value={formData.username}
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
                                {!errors.username && formData.username && (
                                    <p className='mt-1 text-xs text-green-400'>
                                        ✓ Username looks good!
                                    </p>
                                )}
                                {errors.username && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.username}
                                    </p>
                                )}
                                {!formData.username && (
                                    <p className='mt-1 text-xs text-gray-500'>
                                        3-20 characters, letters, numbers, and underscores only
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email & Gender Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {/* Email Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='email'
                                    className='block text-sm font-medium text-pink-400 mb-1'>
                                    Email Address
                                </label>
                                <div className='relative'>
                                    <input
                                        id='email'
                                        name='email'
                                        type='email'
                                        required
                                        value={formData.email}
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
                                {!errors.email && formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
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
                                    required
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-1 focus:outline-none transition-all duration-200 ${errors.gender
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-600 focus:border-indigo-400 focus:ring-indigo-400'
                                        }`}>
                                    <option value=''>Select Gender</option>
                                    <option value='male'>Male</option>
                                    <option value='female'>Female</option>
                                    <option value='other'>Other</option>
                                    <option value='prefer-not-to-say'>
                                        Prefer not to say
                                    </option>
                                </select>
                                {errors.gender && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.gender}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Password & Confirm Password Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {/* Password Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='password'
                                    className='block text-sm font-medium text-cyan-400 mb-1'>
                                    Password
                                </label>
                                <div className='relative'>
                                    <input
                                        id='password'
                                        name='password'
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        required
                                        min={6}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 ${errors.password
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-cyan-400 focus:ring-cyan-400'
                                            }`}
                                        placeholder='Create a password'
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
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-200'>
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
                                {formData.password && (
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
                            </div>

                            {/* Confirm Password Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='confirmPassword'
                                    className='block text-sm font-medium text-teal-400 mb-1'>
                                    Confirm Password
                                </label>
                                <div className='relative'>
                                    <input
                                        id='confirmPassword'
                                        name='confirmPassword'
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 ${errors.confirmPassword
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-teal-400 focus:ring-teal-400'
                                            }`}
                                        placeholder='Confirm your password'
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
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-400 transition-colors duration-200'>
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
                                {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
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
                                required
                                value={formData.dob}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-1 focus:outline-none transition-all duration-200 ${errors.dob
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-gray-600 focus:border-violet-400 focus:ring-violet-400'
                                    }`}
                            />
                            {errors.dob && (
                                <p className='mt-1 text-sm text-red-400'>
                                    {errors.dob}
                                </p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className='space-y-2 pt-2'>
                            <div className='flex items-start'>
                                <input
                                    id='terms'
                                    name='terms'
                                    type='checkbox'
                                    checked={formData.terms}
                                    onChange={handleInputChange}
                                    className={`h-4 w-4 mt-0.5 text-blue-500 bg-gray-700 border rounded focus:ring-1 ${errors.terms
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-500 focus:ring-blue-500'
                                        }`}
                                />
                                <label
                                    htmlFor='terms'
                                    className='ml-2 block text-sm text-gray-300 select-none cursor-pointer'>
                                    I agree to the{' '}
                                    <a
                                        href='#'
                                        className='text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline'>
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a
                                        href='#'
                                        className='text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline'>
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>
                            {errors.terms && (
                                <p className='text-sm text-red-400 ml-6'>
                                    {errors.terms}
                                </p>
                            )}
                        </div>
                        {/* Submit Button */}
                        <button
                            disabled={isLoading}
                            type='submit'
                            className='w-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 text-white 
                            py-3 px-4 rounded-lg font-semibold text-sm
                            hover:from-blue-400 hover:via-purple-400 hover:to-pink-400
                            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
                            focus:ring-offset-gray-800 transform hover:scale-[1.02] active:scale-[0.98]
                            transition-all duration-200 
                            shadow-lg hover:shadow-xl
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'>
                            {isLoading ? (
                                <div className='flex items-center justify-center space-x-2'>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="text-sm">Creating account...</span>
                                </div>
                            ) : (
                                <div className='flex items-center justify-center space-x-2'>
                                    <span>Sign Up</span>
                                    <ArrowRight className='h-4 w-4' />
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className='mt-6'>
                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-600'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-2 bg-gray-800 text-gray-400'>
                                    Or register with
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Social Registration */}
                    <div className='mt-6 grid grid-cols-2 gap-3'>
                        <button className='w-full inline-flex justify-center items-center py-3 px-4 border border-gray-600 rounded-lg bg-gray-700/50 text-sm font-medium text-gray-300 hover:bg-gray-600/50 hover:border-blue-500 hover:text-white transition-all duration-200'>
                            <svg
                                className='w-4 h-4'
                                fill='currentColor'
                                viewBox='0 0 24 24'>
                                <path
                                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                    fill='#4285F4'
                                />
                                <path
                                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                    fill='#34A853'
                                />
                                <path
                                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                    fill='#FBBC05'
                                />
                                <path
                                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                    fill='#EA4335'
                                />
                            </svg>
                            <span className='ml-2'>Google</span>
                        </button>
                        <button className='w-full inline-flex justify-center items-center py-3 px-4 border border-gray-600 rounded-lg bg-gray-700/50 text-sm font-medium text-gray-300 hover:bg-gray-600/50 hover:border-blue-500 hover:text-white transition-all duration-200'>
                            <svg
                                className='w-4 h-4'
                                fill='#1877F2'
                                viewBox='0 0 24 24'>
                                <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                            </svg>
                            <span className='ml-2'>Facebook</span>
                        </button>
                    </div>
                </div>

                {/* Login Link */}
                <div className='text-center'>
                    <p className='text-gray-400'>
                        Already have an account?{' '}
                        <a
                            href='/login'
                            className='text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 hover:underline'>
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
