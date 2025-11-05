import { useState } from 'react';

const RegisterScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.username.trim())
            newErrors.username = 'Username is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.confirmPassword)
            newErrors.confirmPassword = 'Please confirm your password';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.gender) newErrors.gender = 'Please select your gender';

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Handle registration logic here
            console.log('Registration attempt:', formData);
        }
    };

    return (
        <div className='min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
            <div className='max-w-4xl w-full space-y-8'>
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
                <div className='bg-gray-800 rounded-xl p-8 border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.3),0_0_40px_rgba(129,140,248,0.2),0_0_60px_rgba(192,132,252,0.1)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4),0_0_60px_rgba(129,140,248,0.3),0_0_90px_rgba(192,132,252,0.2)] transition-all duration-300'>
                    <form
                        onSubmit={handleSubmit}
                        className='space-y-5'>
                        {/* Name & Username Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {/* Name Field */}
                            <div>
                                <label
                                    htmlFor='name'
                                    className='block text-sm font-medium text-[#38bdf8] mb-2'>
                                    Full Name
                                </label>
                                <div className='relative'>
                                    <input
                                        id='name'
                                        name='name'
                                        type='text'
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 ${
                                            errors.name
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-gray-600 focus:border-[#38bdf8] focus:shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                                        }`}
                                        placeholder='Enter your full name'
                                    />
                                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
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
                            <div>
                                <label
                                    htmlFor='username'
                                    className='block text-sm font-medium text-[#818cf8] mb-2'>
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
                                        className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 ${
                                            errors.username
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-gray-600 focus:border-[#818cf8] focus:shadow-[0_0_15px_rgba(129,140,248,0.5)]'
                                        }`}
                                        placeholder='Choose a username'
                                    />
                                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                        <svg
                                            className='h-5 w-5 text-gray-400'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
                                            />
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='m7 7 5-3 5 3'
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {errors.username && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.username}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email & Gender Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor='email'
                                    className='block text-sm font-medium text-[#c084fc] mb-2'>
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
                                        className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 ${
                                            errors.email
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-gray-600 focus:border-[#c084fc] focus:shadow-[0_0_15px_rgba(192,132,252,0.5)]'
                                        }`}
                                        placeholder='Enter your email'
                                    />
                                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
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
                                {errors.email && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Gender Field */}
                            <div>
                                <label
                                    htmlFor='gender'
                                    className='block text-sm font-medium text-[#e879f9] mb-2'>
                                    Gender
                                </label>
                                <select
                                    id='gender'
                                    name='gender'
                                    required
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white focus:ring-0 focus:outline-none transition-all duration-300 ${
                                        errors.gender
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-600 focus:border-[#e879f9] focus:shadow-[0_0_15px_rgba(232,121,249,0.5)]'
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
                            <div>
                                <label
                                    htmlFor='password'
                                    className='block text-sm font-medium text-[#22d3ee] mb-2'>
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
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 ${
                                            errors.password
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-gray-600 focus:border-[#22d3ee] focus:shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                                        }`}
                                        placeholder='Create a password'
                                    />
                                    <button
                                        type='button'
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#22d3ee] transition-colors duration-300'>
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
                                {errors.password && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label
                                    htmlFor='confirmPassword'
                                    className='block text-sm font-medium text-[#38bdf8] mb-2'>
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
                                        className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 ${
                                            errors.confirmPassword
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-gray-600 focus:border-[#38bdf8] focus:shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                                        }`}
                                        placeholder='Confirm your password'
                                    />
                                    <button
                                        type='button'
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#38bdf8] transition-colors duration-300'>
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
                                {errors.confirmPassword && (
                                    <p className='mt-1 text-sm text-red-400'>
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Date of Birth Field */}
                        <div>
                            <label
                                htmlFor='dob'
                                className='block text-sm font-medium text-[#818cf8] mb-2'>
                                Date of Birth
                            </label>
                            <input
                                id='dob'
                                name='dob'
                                type='date'
                                required
                                value={formData.dob}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white focus:ring-0 focus:outline-none transition-all duration-300 ${
                                    errors.dob
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-600 focus:border-[#818cf8] focus:shadow-[0_0_15px_rgba(129,140,248,0.5)]'
                                }`}
                            />
                            {errors.dob && (
                                <p className='mt-1 text-sm text-red-400'>
                                    {errors.dob}
                                </p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className='flex items-center'>
                            <input
                                id='terms'
                                name='terms'
                                type='checkbox'
                                required
                                className='h-4 w-4 text-[#38bdf8] bg-gray-700 border-gray-600 rounded focus:ring-[#38bdf8] focus:ring-2'
                            />
                            <label
                                htmlFor='terms'
                                className='ml-2 block text-sm text-gray-300'>
                                I agree to the{' '}
                                <a
                                    href='#'
                                    className='text-[#38bdf8] hover:text-[#818cf8] transition-colors duration-300'>
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a
                                    href='#'
                                    className='text-[#c084fc] hover:text-[#e879f9] transition-colors duration-300'>
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            className='w-full bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] text-white py-3 px-4 rounded-lg font-medium hover:from-[#818cf8] hover:via-[#c084fc] hover:to-[#e879f9] focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(129,140,248,0.6)]'>
                            Create Account
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
                        <button className='w-full inline-flex justify-center py-2 px-4 border-2 border-gray-600 rounded-lg bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 hover:border-[#38bdf8] hover:text-white transition-all duration-300'>
                            <svg
                                className='w-5 h-5'
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
                        <button className='w-full inline-flex justify-center py-2 px-4 border-2 border-gray-600 rounded-lg bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 hover:border-[#818cf8] hover:text-white transition-all duration-300'>
                            <svg
                                className='w-5 h-5'
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
                            className='text-[#38bdf8] hover:text-[#818cf8] font-medium transition-colors duration-300'>
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
