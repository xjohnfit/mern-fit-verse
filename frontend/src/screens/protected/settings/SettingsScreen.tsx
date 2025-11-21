import { toast } from 'sonner';
import { setCredentials } from '@/slices/authSlice';
import { useUpdateUserProfileMutation } from '@/slices/usersApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { User } from 'lucide-react';

// Components
import { Tabs } from '@/components/ui/tabs';
import ProfileSettingsTab from '@/screens/protected/settings/components/ProfileSettingsTab';
import AppearanceSettingsTab from '@/screens/protected/settings/components/AppearanceSettingsTab';

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

            // Convert photo file to base64 if selected
            if (photoFile) {
                console.log('Converting photo file to base64:', {
                    name: photoFile.name,
                    type: photoFile.type,
                    size: photoFile.size,
                });

                const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(photoFile);
                });

                updateData.photo = base64;
            }

            // Only include password if it's provided
            if (profileData.password) {
                updateData.password = profileData.password;
            }

            // Only include height and weight if they have valid values
            if (profileData.height) {
                updateData.height = profileData.height;
            }
            if (profileData.weight) {
                updateData.weight = profileData.weight;
            }
            if (profileData.weightUnit) {
                updateData.weightUnit = profileData.weightUnit;
            }

            console.log('Submitting profile update...');
            const res = await updateUserProfile(updateData).unwrap();
            console.log('Profile update successful:', res);
            dispatch(setCredentials({ ...res }));
            toast.success('Profile updated successfully');
        } catch (err: string | any) {
            console.error('Profile update error:', err);

            let errorMessage = 'An error occurred';

            if (err?.status === 'FETCH_ERROR') {
                errorMessage =
                    'Unable to connect to the server. Please check your connection.';
            } else if (err?.status === 413) {
                errorMessage =
                    'File size too large. Please choose a smaller image (max 10MB).';
            } else if (err?.data?.message) {
                errorMessage = err.data.message;
            } else if (err?.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage, { duration: 6000 });
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
