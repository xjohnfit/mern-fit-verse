import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordFieldsProps {
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    errors: { [key: string]: string; };
    passwordStrength: {
        score: number;
        text: string;
        color: string;
    };
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggleShowPassword: () => void;
    onToggleShowConfirmPassword: () => void;
}

const PasswordFields = ({
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    errors,
    passwordStrength,
    onPasswordChange,
    onConfirmPasswordChange,
    onToggleShowPassword,
    onToggleShowConfirmPassword,
}: PasswordFieldsProps) => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {/* Password Field */}
            <div className='space-y-2'>
                <label
                    htmlFor='password'
                    className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Change Password{' '}
                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                        (optional)
                    </span>
                </label>
                <div className='relative group'>
                    <input
                        id='password'
                        name='password'
                        autoComplete='new-password'
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={onPasswordChange}
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
                        onClick={onToggleShowPassword}
                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-500 transition-colors duration-200'>
                        {showPassword ? (
                            <EyeOff className='h-5 w-5' />
                        ) : (
                            <Eye className='h-5 w-5' />
                        )}
                    </button>
                </div>
                {/* Password Strength Indicator */}
                {password && (
                    <div className='mt-2'>
                        <div className='flex justify-between items-center mb-1'>
                            <span className='text-xs text-gray-600 dark:text-gray-400'>
                                Password Strength
                            </span>
                            <span
                                className={`text-xs font-medium ${passwordStrength.score === 1
                                        ? 'text-red-500 dark:text-red-400'
                                        : passwordStrength.score === 2
                                            ? 'text-yellow-500 dark:text-yellow-400'
                                            : passwordStrength.score === 3
                                                ? 'text-blue-500 dark:text-blue-400'
                                                : passwordStrength.score === 4
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                {passwordStrength.text}
                            </span>
                        </div>
                        <div className='w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5'>
                            <div
                                className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                style={{
                                    width: `${(passwordStrength.score / 4) * 100
                                        }%`,
                                }}></div>
                        </div>
                    </div>
                )}
                {errors.password && (
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
                        {errors.password}
                    </p>
                )}
                {!password && (
                    <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
                        Leave blank to keep current password
                    </p>
                )}
            </div>

            {/* Confirm Password Field */}
            <div className='space-y-2'>
                <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Confirm New Password
                </label>
                <div className='relative group'>
                    <input
                        id='confirmPassword'
                        name='confirmPassword'
                        autoComplete='new-password'
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={onConfirmPasswordChange}
                        className={`w-full px-4 py-3 pl-11 pr-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.confirmPassword
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500/20'
                            } ${!password ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        placeholder='Confirm new password'
                        disabled={!password}
                    />
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Lock className='h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-200' />
                    </div>
                    <button
                        type='button'
                        disabled={!password}
                        onClick={onToggleShowConfirmPassword}
                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-500 transition-colors duration-200 disabled:opacity-50'>
                        {showConfirmPassword ? (
                            <EyeOff className='h-5 w-5' />
                        ) : (
                            <Eye className='h-5 w-5' />
                        )}
                    </button>
                </div>
                {!errors.confirmPassword &&
                    confirmPassword &&
                    password === confirmPassword && (
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
                            Passwords match
                        </p>
                    )}
                {errors.confirmPassword && (
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
                        {errors.confirmPassword}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PasswordFields;
