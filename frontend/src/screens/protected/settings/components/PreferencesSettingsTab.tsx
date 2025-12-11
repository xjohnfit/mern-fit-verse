import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Scale, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateUserProfileMutation } from '@/slices/usersApiSlice';
import { setCredentials } from '@/slices/authSlice';
import DeleteAccount from '@/screens/protected/settings/components/DeleteAccount';

const PreferencesSettingsTab = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: any) => state.auth);
    const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

    const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
    const [restTimer, setRestTimer] = useState<number>(2);

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

            {/* Delete Account */}
            <div className='bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 p-6'>
                <DeleteAccount />
            </div>
        </div>
    );
};

export default PreferencesSettingsTab;

