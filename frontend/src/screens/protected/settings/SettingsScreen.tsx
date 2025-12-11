import { toast } from 'sonner';
import { setCredentials } from '@/slices/authSlice';
import { useUpdateUserProfileMutation } from '@/slices/usersApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { User } from 'lucide-react';
import { addCacheBuster } from '@/lib/cacheBuster';
import { kgToLbs } from '@/lib/weightConversion';

// Components
import { Tabs } from '@/components/ui/tabs';
import ProfileSettingsTab from '@/screens/protected/settings/components/ProfileSettingsTab';
import AppearanceSettingsTab from '@/screens/protected/settings/components/AppearanceSettingsTab';
import PreferencesSettingsTab from '@/screens/protected/settings/components/PreferencesSettingsTab';

const SettingsScreen = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: any) => state.auth);
    const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

    const handleUpdate = async (profileData: any, photoFile: File | null) => {
        try {
            // Prepare JSON payload
            const updateData: any = {
                name: profileData.name,
                username: profileData.username,
                email: profileData.email,
                dob: profileData.dob,
                gender: profileData.gender,
                goal: profileData.goal,
            };

            // Handle photo upload if file is provided
            if (photoFile) {
                console.log('=== PHOTO UPLOAD START ===');
                console.log('Photo file details:', {
                    name: photoFile.name,
                    type: photoFile.type,
                    size: photoFile.size,
                    sizeInMB: (photoFile.size / (1024 * 1024)).toFixed(2) + 'MB'
                });

                // Validate file size (10MB limit for mobile compatibility)
                const maxSizeInMB = 10;
                const fileSizeInMB = photoFile.size / (1024 * 1024);
                if (fileSizeInMB > maxSizeInMB) {
                    toast.error(`Image size (${fileSizeInMB.toFixed(2)}MB) exceeds ${maxSizeInMB}MB limit`);
                    return;
                }

                // Wait for FileReader to complete before proceeding
                const photoData = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();

                    reader.onload = () => {
                        const result = reader.result as string;
                        console.log('Photo read successfully');
                        console.log('Base64 string length:', result.length);
                        console.log('Base64 prefix:', result.substring(0, 50));
                        resolve(result);
                    };

                    reader.onerror = (error) => {
                        console.error('FileReader error:', error);
                        reject(new Error('Failed to read photo file'));
                    };

                    reader.readAsDataURL(photoFile);
                });

                updateData.photo = photoData;
            }            // Only include password if it's provided
            if (profileData.password) {
                updateData.password = profileData.password;
            }

            // Only include height and weight if they have valid values
            if (profileData.height) {
                updateData.height = profileData.height;
            }
            if (profileData.weight) {
                // Always convert weight to lbs before saving to database
                const weightValue = parseFloat(profileData.weight);
                if (profileData.weightUnit === 'kg') {
                    // User entered weight in kg, convert to lbs for database
                    updateData.weight = kgToLbs(weightValue);
                } else {
                    // Already in lbs
                    updateData.weight = weightValue;
                }
            }
            // Always store the user's preferred unit for display purposes
            if (profileData.weightUnit) {
                updateData.weightUnit = profileData.weightUnit;
            }

            const res = await updateUserProfile(updateData).unwrap();

            // Add timestamp to photo URL to bust cache on mobile devices
            const updatedUser = { ...res };
            if (updatedUser.photo) {
                updatedUser.photo = addCacheBuster(updatedUser.photo);
            }

            dispatch(setCredentials(updatedUser));
            console.log('=== PHOTO UPLOAD END (SUCCESS) ===');
            toast.success('Profile updated successfully');
        } catch (err: string | any) {
            console.error('=== PROFILE UPDATE ERROR ===');
            console.error('Error object:', err);
            console.error('Error data:', err?.data);
            console.error('Error message:', err?.data?.message || err?.message);
            console.error('Error status:', err?.status);
            console.error('Full error:', JSON.stringify(err, null, 2));
            console.error('=== PHOTO UPLOAD END (FAILED) ===');

            const errorMessage = err?.data?.message || err?.message || 'Failed to update profile';
            toast.error(errorMessage, {
                description: 'Check browser console (F12) for detailed error logs'
            });
        }
    };

    const tabs = [
        {
            title: 'Profile',
            value: 'profile',
            content: (
                <ProfileSettingsTab
                    userInfo={userInfo}
                    isLoading={isLoading}
                    onUpdate={handleUpdate}
                />
            ),
        },
        {
            title: 'Appearance',
            value: 'appearance',
            content: <AppearanceSettingsTab />,
        },
        {
            title: 'Preferences',
            value: 'preferences',
            content: <PreferencesSettingsTab />,
        },
    ];

    return (
        <div className='min-h-screen relative overflow-hidden'>
            {/* Animated Background */}
            <div className='absolute inset-0 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20'>
                <div className='absolute top-0 left-0 w-full h-full'>
                    <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse'></div>
                    <div className='absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/10 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-500'></div>
                </div>
            </div>

            {/* Main Content */}
            <div className='relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12'>
                <div className='max-w-5xl w-full space-y-8'>
                    {/* Header */}
                    <div className='text-center'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg'>
                            <User className='w-8 h-8 text-white' />
                        </div>
                        <h1 className='p-2 text-4xl sm:text-5xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3'>
                            Settings
                        </h1>
                        <p className='text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto'>
                            Manage your profile and preferences
                        </p>
                    </div>

                    {/* Settings Tabs */}
                    <div className='bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl dark:hover:shadow-blue-500/10 transition-all duration-500'>
                        <Tabs
                            tabs={tabs}
                            defaultValue='profile'
                            containerClassName='mb-8 justify-center'
                            activeTabClassName='bg-linear-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700'
                            tabClassName='hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors'
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
