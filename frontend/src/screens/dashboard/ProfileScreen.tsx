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
        <div className='min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
            <div className='max-w-4xl w-full space-y-8'>
                {/* Header */}
                <div className='text-center'>
                    <h1 className='text-4xl font-bold bg-linear-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent mb-2'>
                        Update Your Profile
                    </h1>
                </div>
                <div className='bg-gray-800 rounded-xl p-8 border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.3),0_0_40px_rgba(129,140,248,0.2),0_0_60px_rgba(192,132,252,0.1)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4),0_0_60px_rgba(129,140,248,0.3),0_0_90px_rgba(192,132,252,0.2)] transition-all duration-300'>

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
                                <label
                                    htmlFor='goal'
                                    className='block text-sm font-medium text-[#22d3ee] mb-2'>
                                    Fitness Goal
                                </label>
                                <div className='relative'>
                                    <input
                                        id='goal'
                                        name='goal'
                                        type='text'
                                        value={profileData.goal}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 border-gray-600 focus:border-[#22d3ee] focus:shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                                        placeholder='e.g., Lose weight, Build muscle, Stay healthy'
                                    />
                                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                                        <Target className='h-5 w-5 text-gray-400' />
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 border-gray-600 focus:border-[#38bdf8] focus:shadow-[0_0_15px_rgba(56,189,248,0.5)]'
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
                                        autoComplete='username'
                                        value={profileData.username}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 border-gray-600 focus:border-[#818cf8] focus:shadow-[0_0_15px_rgba(129,140,248,0.5)]'
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
                                        autoComplete='email'
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 border-gray-600 focus:border-[#818cf8] focus:shadow-[0_0_15px_rgba(129,140,248,0.5)]'
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
                                    value={profileData.gender}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white focus:ring-0 focus:outline-none transition-all duration-300 border-gray-600 focus:border-[#e879f9] focus:shadow-[0_0_15px_rgba(232,121,249,0.5)]'
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
                            <div>
                                <label
                                    htmlFor='password'
                                    className='block text-sm font-medium text-[#22d3ee] mb-2'>
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
                                        className='w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 border-gray-600 focus:border-[#22d3ee] focus:shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                                        placeholder='Change password'
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
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label
                                    htmlFor='confirmPassword'
                                    className='block text-sm font-medium text-[#38bdf8] mb-2'>
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
                                        className='w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 border-gray-600 focus:border-[#38bdf8] focus:shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                                        placeholder='Confirm change password'
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
                            </div>
                        </div>

                        {/* Date of Birth, Height & Weight Row */}
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
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
                                    value={profileData.dob}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white focus:ring-0 focus:outline-none transition-all duration-300 border-gray-600 focus:border-[#818cf8] focus:shadow-[0_0_15px_rgba(129,140,248,0.5)]'
                                />
                            </div>

                            {/* Height Field */}
                            <div>
                                <label
                                    htmlFor='height'
                                    className='block text-sm font-medium text-[#c084fc] mb-2'>
                                    Height (cm)
                                </label>
                                <div className='relative'>
                                    <input
                                        id='height'
                                        name='height'
                                        type='number'
                                        value={profileData.height}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 border-gray-600 focus:border-[#e879f9] focus:shadow-[0_0_15px_rgba(232,121,249,0.5)]'
                                        placeholder='Enter your height'
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
                                                d='M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v6a1 1 0 01-1 1H8a1 1 0 01-1-1V4a1 1 0 011-1V2m8 2v16l-4-2-4 2V4'
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Weight Field */}
                            <div>
                                <label
                                    htmlFor='weight'
                                    className='block text-sm font-medium text-[#e879f9] mb-2'>
                                    Weight (kg)
                                </label>
                                <div className='relative'>
                                    <input
                                        id='weight'
                                        name='weight'
                                        type='number'
                                        value={profileData.weight}
                                        onChange={handleInputChange}
                                        className='w-full px-4 py-3 bg-gray-700 border-2 rounded-lg text-white placeholder-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 border-gray-600 focus:border-[#e879f9] focus:shadow-[0_0_15px_rgba(232,121,249,0.5)]'
                                        placeholder='Enter your weight'
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
                            className='cursor-pointer w-full bg-linear-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] text-white py-3 px-4 rounded-lg font-medium hover:from-[#818cf8] hover:via-[#c084fc] hover:to-[#e879f9] focus:outline-none focus:ring-2 focus:ring-[#38bdf8] focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(129,140,248,0.6)]'>
                            {isLoading ? (

                                <div className='flex items-center justify-center space-x-2'>
                                    <svg aria-hidden="true" className="w- h-6 text-gray-200 animate-spin dark:text-gray-600 fill-black/50" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                    <span className="">Loading...</span>
                                </div>

                            ) : (
                                <div className='flex items-center justify-center space-x-2'>
                                    <span>Update Details</span>
                                    <ArrowRight className='inline-block h-6 w-6' />
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
