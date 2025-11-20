import { User, Mail } from 'lucide-react';
import type { BasicInfoFieldsProps } from '@/screens/protected/settings/settings.types';

const BasicInfoFields = ({
    name,
    username,
    email,
    errors,
    onChange,
}: BasicInfoFieldsProps) => {
    return (
        <>
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
                            value={name}
                            onChange={onChange}
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
                    {!errors.name && name && name.length >= 2 && (
                        <p className='mt-2 text-sm text-green-600 dark:text-green-400 flex items-center'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='currentColor'
                                viewBox='0 0 20 20'>
                                <path
                                    fillRule='evenodd'
                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            Name looks good!
                        </p>
                    )}
                    {errors.name && (
                        <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='currentColor'
                                viewBox='0 0 20 20'>
                                <path
                                    fillRule='evenodd'
                                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                                    clipRule='evenodd'
                                />
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
                            value={username}
                            onChange={onChange}
                            className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.username
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20'
                                }`}
                            placeholder='Choose a username'
                        />
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <svg
                                className='h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200'
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
                    {!errors.username && username && username.length >= 3 && (
                        <p className='mt-2 text-sm text-green-600 dark:text-green-400 flex items-center'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='currentColor'
                                viewBox='0 0 20 20'>
                                <path
                                    fillRule='evenodd'
                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            Username looks good!
                        </p>
                    )}
                    {errors.username && (
                        <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='currentColor'
                                viewBox='0 0 20 20'>
                                <path
                                    fillRule='evenodd'
                                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            {errors.username}
                        </p>
                    )}
                </div>
            </div>

            {/* Email Field */}
            <div className='space-y-2'>
                <label
                    htmlFor='email'
                    className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Email Address
                </label>
                <div className='relative group'>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        required
                        autoComplete='email'
                        value={email}
                        onChange={onChange}
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
                {!errors.email &&
                    email &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                        <p className='mt-2 text-sm text-green-600 dark:text-green-400 flex items-center'>
                            <svg
                                className='w-4 h-4 mr-1'
                                fill='currentColor'
                                viewBox='0 0 20 20'>
                                <path
                                    fillRule='evenodd'
                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            Valid email address
                        </p>
                    )}
                {errors.email && (
                    <p className='mt-2 text-sm text-red-500 dark:text-red-400 flex items-center'>
                        <svg
                            className='w-4 h-4 mr-1'
                            fill='currentColor'
                            viewBox='0 0 20 20'>
                            <path
                                fillRule='evenodd'
                                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                                clipRule='evenodd'
                            />
                        </svg>
                        {errors.email}
                    </p>
                )}
            </div>
        </>
    );
};

export default BasicInfoFields;
