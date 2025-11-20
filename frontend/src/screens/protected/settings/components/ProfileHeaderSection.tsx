import { Target } from 'lucide-react';
import type { ProfileHeaderSectionProps } from '@/screens/protected/settings/settings.types';

const ProfileHeaderSection = ({
    userName,
    goal,
    onGoalChange,
}: ProfileHeaderSectionProps) => {
    return (
        <div className='flex-1 w-full space-y-4'>
            {/* Welcome User Name */}
            <div className='text-center md:text-left'>
                <h3 className='text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1'>
                    Welcome, {userName || 'User'}!
                </h3>
                <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base'>
                    Keep your profile information current for the best fitness
                    experience.
                </p>
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
                        value={goal}
                        onChange={(e) => onGoalChange(e.target.value)}
                        className='w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20'
                        placeholder='e.g., Lose 10kg, Build muscle, Run a marathon'
                    />
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Target className='h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200' />
                    </div>
                </div>
                {goal && (
                    <p className='mt-1 text-xs text-green-600 dark:text-green-400 flex items-center'>
                        <svg
                            className='w-3 h-3 mr-1'
                            fill='currentColor'
                            viewBox='0 0 20 20'>
                            <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                            />
                        </svg>
                        Goal set - AI will personalize your fitness plan
                    </p>
                )}
                {!goal && (
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                        Set a goal to help AI personalize your fitness journey
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfileHeaderSection;
