import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { setCredentials } from '@/slices/authSlice';
import { useUpdateUserProfileMutation } from '@/slices/usersApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowRight, User, Target } from 'lucide-react';

//Utils functions imports
import { formatDateToInputValue } from '@/lib/formatDate';

const ProfileScreen = () => {
    const [profileData, setProfileData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: '',
        photo: '',
        height: '',
        weight: '',
        goal: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: any) => state.auth);

    const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

    useEffect(() => {
        if (userInfo) {
            setProfileData((prev) => ({
                ...prev,
                name: userInfo.name || '',
                username: userInfo.username || '',
                email: userInfo.email || '',
                dob: formatDateToInputValue(userInfo.dob) || '',
                gender: userInfo.gender || '',
                photo: userInfo.photo || '',
                height: userInfo.height || '',
                weight: userInfo.weight || '',
                goal: userInfo.goal || '',
            }));
        }
    }, [userInfo]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (profileData.password !== profileData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const res = await updateUserProfile({
                _id: userInfo._id,
                name: profileData.name,
                username: profileData.username,
                email: profileData.email,
                password: profileData.password,
                dob: profileData.dob,
                gender: profileData.gender,
                height: Number(profileData.height),
                weight: Number(profileData.weight),
                goal: profileData.goal,
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success('Profile updated successfully');
        } catch (err: string | any) {
            toast.error(err?.data?.message || err.message);
        }
    };

    return (
        <div className='min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
            <div className='max-w-4xl w-full space-y-6'>
                {/* Header */}
                <div className='text-center'>
                    <h1 className='text-4xl font-bold bg-linear-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent mb-2'>
                        Update Your Profile
                    </h1>
                </div>
                <div className='bg-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-gray-700 shadow-2xl hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-300'>

                    {/* Update Profile Form */}
                    <form
                        onSubmit={handleUpdate}
                        className='space-y-5'>
                        {/* Profile Picture & Goal Section */}
                        <div className='flex flex-col md:flex-row items-center gap-8 mb-6'>
                            {/* Profile Picture */}
                            <div className='flex justify-center'>
                                <div className='relative'>
                                    <div className='w-36 h-36 rounded-full bg-gray-700 border-4 border-[#38bdf8] overflow-hidden shadow-[0_0_20px_rgba(56,189,248,0.3)]'>
                                        {profileData.photo ? (
                                            <img
                                                src={profileData.photo}
                                                alt='Profile'
                                                className='w-full h-full object-cover'
                                            />
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center'>
                                                <User className='w-16 h-16 text-gray-400' />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Goal Field */}
                            <div className='flex-1 w-full md:w-auto'>
                                {/* Welcome User Name */}
                                <div className='mb-3'>
                                    <h3 className='text-2xl font-semibold text-white'>
                                        {userInfo?.name || 'User'}
                                    </h3>
                                    <p className='text-gray-400'>Update your profile information below.</p>
                                </div>
                                <label
                                    htmlFor='goal'
                                    className='block text-sm font-medium text-cyan-400 mb-1'>
                                    Fitness Goal
                                </label>
                                <div className='relative'>
                                    <input
                                        id='goal'
                                        name='goal'
                                        type='text'
                                        value={profileData.goal}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400'
                                        placeholder='e.g., Lose weight, Build muscle, Stay healthy'
                                    />
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Target className='h-5 w-5 text-gray-400' />
                                    </div>
                                    <p className='text-xs pl-2 text-gray-500 opacity-75 italic'>AI will use your goal to personalize your fitness plan and suggest exercises.</p>
                                </div>
                            </div>
                        </div>
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
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 border-gray-600 focus:border-blue-400 focus:ring-blue-400'
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
                                        autoComplete='username'
                                        value={profileData.username}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 border-gray-600 focus:border-purple-400 focus:ring-purple-400'
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
                                        autoComplete='email'
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 border-gray-600 focus:border-pink-400 focus:ring-pink-400'
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
                                    value={profileData.gender}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-1 focus:outline-none transition-all duration-200 border-gray-600 focus:border-indigo-400 focus:ring-indigo-400'
                                >
                                    <option value=''>Select Gender</option>
                                    <option value='male'>Male</option>
                                    <option value='female'>Female</option>
                                    <option value='other'>Other</option>
                                    <option value='prefer-not-to-say'>
                                        Prefer not to say
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Password & Confirm Password Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {/* Password Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='password'
                                    className='block text-sm font-medium text-emerald-400 mb-1'>
                                    Change Password
                                </label>
                                <div className='relative'>
                                    <input
                                        id='password'
                                        name='password'
                                        autoComplete='new-password'
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={profileData.password}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 border-gray-600 focus:border-emerald-400 focus:ring-emerald-400'
                                        placeholder='Change password'
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
                                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-400 transition-colors duration-200'>
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
                            </div>

                            {/* Confirm Password Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='confirmPassword'
                                    className='block text-sm font-medium text-teal-400 mb-1'>
                                    Confirm Change Password
                                </label>
                                <div className='relative'>
                                    <input
                                        id='confirmPassword'
                                        name='confirmPassword'
                                        autoComplete='new-password'
                                        type={
                                            showConfirmPassword
                                                ? 'text'
                                                : 'password'
                                        }
                                        value={profileData.confirmPassword}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 border-gray-600 focus:border-teal-400 focus:ring-teal-400'
                                        placeholder='Confirm change password'
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
                            </div>
                        </div>

                        {/* Date of Birth, Height & Weight Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
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
                                    value={profileData.dob}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white focus:ring-1 focus:outline-none transition-all duration-200 border-gray-600 focus:border-violet-400 focus:ring-violet-400'
                                />
                            </div>

                            {/* Height Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='height'
                                    className='block text-sm font-medium text-orange-400 mb-1'>
                                    Height (cm)
                                </label>
                                <div className='relative'>
                                    <input
                                        id='height'
                                        name='height'
                                        type='number'
                                        value={profileData.height}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 border-gray-600 focus:border-orange-400 focus:ring-orange-400'
                                        placeholder='Enter your height'
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
                                                d='M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v6a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1V2m8 2v16l-4-2-4 2V4'
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Weight Field */}
                            <div className='space-y-2'>
                                <label
                                    htmlFor='weight'
                                    className='block text-sm font-medium text-yellow-400 mb-1'>
                                    Weight (kg)
                                </label>
                                <div className='relative'>
                                    <input
                                        id='weight'
                                        name='weight'
                                        type='number'
                                        value={profileData.weight}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 pl-10 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:ring-1 focus:outline-none transition-all duration-200 border-gray-600 focus:border-yellow-400 focus:ring-yellow-400'
                                        placeholder='Enter your weight'
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
                                                d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
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
                                    <span className="text-sm">Updating profile...</span>
                                </div>
                            ) : (
                                <div className='flex items-center justify-center space-x-2'>
                                    <span>Update Details</span>
                                    <ArrowRight className='h-4 w-4' />
                                </div>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
