import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Scale, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateUserProfileMutation, useUpdatePasswordMutation } from '@/slices/usersApiSlice';
import { setCredentials } from '@/slices/authSlice';
import { getPasswordStrength } from '@/lib/getPasswordStrength';
import DeleteAccount from '@/screens/protected/settings/components/DeleteAccount';
import PasswordFields from '@/screens/protected/settings/components/PasswordFields';

const PreferencesSettingsTab = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: any) => state.auth);
    const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
    const [updatePassword, { isLoading: isPasswordLoading }] = useUpdatePasswordMutation();

    const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
    const [restTimer, setRestTimer] = useState<number>(2);
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [passwordErrors, setPasswordErrors] = useState<{
        currentPassword?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    useEffect(() => {
        if (userInfo) {
            setWeightUnit(userInfo.weightUnit || 'lbs');
            // Convert seconds to minutes for display (default 120 seconds = 32minutes)
            const restTimerInMinutes = userInfo.restTimer ? Math.round(userInfo.restTimer / 60) : 2;
            setRestTimer(restTimerInMinutes);
        }
    }, [userInfo]);

    const handleWeightUnitChange = async (newUnit: 'lbs' | 'kg') => {
        try {
            const res = await updateUserProfile({ weightUnit: newUnit }).unwrap();
            dispatch(setCredentials(res));
            setWeightUnit(newUnit);
            toast.success(`Weight unit changed to ${newUnit}`);
        } catch (err: any) {
            const errorMessage = err?.data?.message || err?.message || 'Failed to update weight unit';
            toast.error(errorMessage);
        }
    };

    const handleRestTimerChange = async (minutes: number) => {
        try {
            // Convert minutes to seconds for backend storage
            const seconds = minutes * 60;
            const res = await updateUserProfile({ restTimer: seconds }).unwrap();
            dispatch(setCredentials(res));
            setRestTimer(minutes);
        } catch (err: any) {
            const errorMessage = err?.data?.message || err?.message || 'Failed to update rest timer';
            toast.error(errorMessage);
        }
    };

    const passwordStrength = getPasswordStrength(password);

    const validatePassword = () => {
        const errors: { currentPassword?: string; password?: string; confirmPassword?: string } = {};

        if (!currentPassword) {
            errors.currentPassword = 'Current password is required';
        }

        if (password) {
            if (password.length < 8) {
                errors.password = 'New password must be at least 8 characters';
            }
            if (password !== confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
            }
            if (password === currentPassword) {
                errors.password = 'New password must be different from current password';
            }
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword) {
            toast.error('Please enter your current password');
            return;
        }

        if (!password) {
            toast.error('Please enter a new password');
            return;
        }

        if (!validatePassword()) {
            toast.error('Please fix the password errors');
            return;
        }

        try {
            await updatePassword({
                currentPassword,
                newPassword: password
            }).unwrap();
            setCurrentPassword('');
            setPassword('');
            setConfirmPassword('');
            setPasswordErrors({});
            toast.success('Password updated successfully');
        } catch (err: any) {
            const errorMessage = err?.data?.message || err?.message || 'Failed to update password';
            toast.error(errorMessage);
        }
    };

    const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPassword(e.target.value);
        if (passwordErrors.currentPassword) {
            setPasswordErrors((prev) => ({ ...prev, currentPassword: undefined }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (passwordErrors.password) {
            setPasswordErrors((prev) => ({ ...prev, password: undefined }));
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        if (passwordErrors.confirmPassword) {
            setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
        }
    };

    return (
        <div className='space-y-6'>
            {/* Weight Unit Preference */}
            <div className='bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 p-6'>
                <div className='flex items-center space-x-3 mb-4'>
                    <div className='p-2 bg-linear-to-r from-blue-500 to-indigo-500 rounded-lg'>
                        <Scale className='w-5 h-5 text-white' />
                    </div>
                    <div>
                        <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100'>
                            Weight Unit
                        </h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Choose your preferred weight measurement
                        </p>
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    {(['lbs', 'kg'] as const).map((unit) => {
                        const isSelected = weightUnit === unit;
                        return (
                            <button
                                key={unit}
                                type='button'
                                onClick={() => handleWeightUnitChange(unit)}
                                disabled={isLoading}
                                className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-center group hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isSelected
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500'
                                }`}
                            >
                                <div className='flex flex-col items-center space-y-2'>
                                    <div
                                        className={`text-2xl font-bold ${
                                            isSelected
                                                ? 'text-blue-700 dark:text-blue-300'
                                                : 'text-gray-900 dark:text-gray-100'
                                        }`}
                                    >
                                        {unit.toUpperCase()}
                                    </div>
                                    <div
                                        className={`text-xs ${
                                            isSelected
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                    >
                                        {unit === 'lbs' ? 'Pounds' : 'Kilograms'}
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className='absolute top-2 right-2'>
                                        <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
                                            <svg
                                                className='w-4 h-4 text-white'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M5 13l4 4L19 7'
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Rest Timer Preference */}
            <div className='bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 p-6'>
                <div className='flex items-center space-x-3 mb-4'>
                    <div className='p-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg'>
                        <Timer className='w-5 h-5 text-white' />
                    </div>
                    <div>
                        <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100'>
                            Rest Timer
                        </h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Default rest time between sets
                        </p>
                    </div>
                </div>

                <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                            Duration: <span className='text-lg font-bold text-purple-600 dark:text-purple-400'>{restTimer}</span> minute{restTimer !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <input
                        type='range'
                        min='1'
                        max='10'
                        step='1'
                        value={restTimer}
                        onChange={(e) => handleRestTimerChange(parseInt(e.target.value))}
                        className='w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500'
                    />
                    <div className='flex justify-between text-xs text-gray-500 dark:text-gray-400'>
                        <span>1 min</span>
                        <span>5 mins</span>
                        <span>10 mins</span>
                    </div>
                </div>
            </div>

            {/* Change Password Section */}
            <form onSubmit={handlePasswordUpdate} className='bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 p-6'>
                <div className='flex items-center space-x-3 mb-6'>
                    <div className='p-2 bg-linear-to-r from-green-500 to-teal-500 rounded-lg'>
                        <svg
                            className='w-5 h-5 text-white'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100'>
                            Change Password
                        </h3>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Update your account password
                        </p>
                    </div>
                </div>

                {/* Current Password Field */}
                <div className='space-y-2 mb-6'>
                    <label
                        htmlFor='currentPassword'
                        className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                        Current Password
                    </label>
                    <div className='relative group'>
                        <input
                            id='currentPassword'
                            name='currentPassword'
                            autoComplete='current-password'
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={handleCurrentPasswordChange}
                            className={`w-full px-4 py-3 pl-11 pr-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${
                                passwordErrors.currentPassword
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                            }`}
                            placeholder='Enter your current password'
                        />
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <svg
                                className='h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200'
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
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200'>
                            {showCurrentPassword ? (
                                <svg
                                    className='h-5 w-5'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
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
                    {passwordErrors.currentPassword && (
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
                            {passwordErrors.currentPassword}
                        </p>
                    )}
                </div>

                <PasswordFields
                    password={password}
                    confirmPassword={confirmPassword}
                    showPassword={showPassword}
                    showConfirmPassword={showConfirmPassword}
                    errors={passwordErrors}
                    passwordStrength={passwordStrength}
                    onPasswordChange={handlePasswordChange}
                    onConfirmPasswordChange={handleConfirmPasswordChange}
                    onToggleShowPassword={() => setShowPassword(!showPassword)}
                    onToggleShowConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                <div className='mt-6'>
                    <button
                        type='submit'
                        disabled={isPasswordLoading || !currentPassword || !password}
                        className='w-full px-6 py-3 bg-linear-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl'
                    >
                        {isPasswordLoading ? 'Updating Password...' : 'Update Password'}
                    </button>
                </div>
            </form>

            {/* Delete Account */}
            <div className='bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 p-6'>
                <DeleteAccount />
            </div>
        </div>
    );
};

export default PreferencesSettingsTab;

