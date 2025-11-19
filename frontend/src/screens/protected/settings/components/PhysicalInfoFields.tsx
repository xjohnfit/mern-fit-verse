interface PhysicalInfoFieldsProps {
    height: string;
    weight: string;
    weightUnit: string;
    errors: { [key: string]: string; };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PhysicalInfoFields = ({
    height,
    weight,
    weightUnit,
    errors,
    onChange,
}: PhysicalInfoFieldsProps) => {
    return (
        <div className='space-y-6'>
            {/* Weight Unit Preference */}
            <div className='space-y-2'>
                <label
                    htmlFor='weightUnit'
                    className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Weight Unit Preference
                </label>
                <div className='relative group'>
                    <select
                        id='weightUnit'
                        name='weightUnit'
                        value={weightUnit}
                        onChange={onChange}
                        className='w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none transition-all duration-300 group-hover:shadow-md appearance-none cursor-pointer'>
                        <option value='kg'>Kilograms (kg)</option>
                        <option value='lbs'>Pounds (lbs)</option>
                    </select>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <svg
                            className='h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
                            />
                        </svg>
                    </div>
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                        <svg
                            className='h-5 w-5 text-gray-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 9l-7 7-7-7'
                            />
                        </svg>
                    </div>
                </div>
                <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
                    Select your preferred unit for weight measurements
                </p>
            </div>

            {/* Height and Weight Fields */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                {/* Height Field */}
                <div className='space-y-2'>
                    <label
                        htmlFor='height'
                        className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                        Height (cm){' '}
                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                            (optional)
                        </span>
                    </label>
                    <div className='relative group'>
                        <input
                            id='height'
                            name='height'
                            type='number'
                            min='50'
                            max='300'
                            value={height}
                            onChange={onChange}
                            className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.height
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                                }`}
                            placeholder='Enter your height'
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
                                    d='M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'
                                />
                            </svg>
                        </div>
                    </div>
                    {!errors.height && height && (
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
                            Height recorded
                        </p>
                    )}
                    {errors.height && (
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
                            {errors.height}
                        </p>
                    )}
                </div>

                {/* Weight Field */}
                <div className='space-y-2'>
                    <label
                        htmlFor='weight'
                        className='block text-sm font-semibold text-gray-700 dark:text-gray-300'>
                        Weight ({weightUnit}){' '}
                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                            (optional)
                        </span>
                    </label>
                    <div className='relative group'>
                        <input
                            id='weight'
                            name='weight'
                            type='number'
                            min='20'
                            max='500'
                            value={weight}
                            onChange={onChange}
                            className={`w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 border rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-300 group-hover:shadow-md ${errors.weight
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/20'
                                }`}
                            placeholder='Enter your weight'
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
                                    d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
                                />
                            </svg>
                        </div>
                    </div>
                    {!errors.weight && weight && (
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
                            Weight recorded
                        </p>
                    )}
                    {errors.weight && (
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
                            {errors.weight}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhysicalInfoFields;
