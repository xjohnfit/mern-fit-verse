import { Calendar, Users } from 'lucide-react';
import type { PersonalInfoFieldsProps } from '@/screens/protected/settings/settings.types';

const PersonalInfoFields = ({
    dob,
    gender,
    errors,
    onChange,
}: PersonalInfoFieldsProps) => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {/* Date of Birth Field */}
            <div className='space-y-2'>
                <label
                    htmlFor='dob'
                    className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Date of Birth
                </label>
                <div className='relative group'>
                    <input
                        id='dob'
                        name='dob'
                        type='date'
                        value={dob}
                        onChange={onChange}
                        className={`w-full px-3 sm:px-4 py-3 pl-10 sm:pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md text-sm ${errors.dob
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20'
                            }`}
                    />
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Calendar className='h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200' />
                    </div>
                </div>
                {!errors.dob && dob && (
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
                        Date selected
                    </p>
                )}
                {errors.dob && (
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
                        {errors.dob}
                    </p>
                )}
            </div>

            {/* Gender Field */}
            <div className='space-y-2'>
                <label
                    htmlFor='gender'
                    className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Gender
                </label>
                <div className='relative group'>
                    <select
                        id='gender'
                        name='gender'
                        value={gender}
                        onChange={onChange}
                        className='w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20'>
                        <option value=''>Select Gender</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                        <option value='other'>Other</option>
                    </select>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Users className='h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200' />
                    </div>
                </div>
                {gender && (
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
                        Gender selected
                    </p>
                )}
            </div>
        </div>
    );
};

export default PersonalInfoFields;
