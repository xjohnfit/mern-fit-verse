import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { setCredentials } from '@/slices/authSlice';
import { useUpdateUserProfileMutation } from '@/slices/usersApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { User } from 'lucide-react';

// Utils functions imports
import { formatDateToInputValue } from '@/lib/formatDate';
import { getPasswordStrength } from '@/lib/getPasswordStrength';

// Components
import ThemeSettingsSection from '@/screens/protected/settings/components/ThemeSettingsSection';
import ProfilePhotoSection from '@/screens/protected/settings/components/ProfilePhotoSection';
import ProfileHeaderSection from '@/screens/protected/settings/components/ProfileHeaderSection';
import BasicInfoFields from '@/screens/protected/settings/components/BasicInfoFields';
import PersonalInfoFields from '@/screens/protected/settings/components/PersonalInfoFields';
import PhysicalInfoFields from '@/screens/protected/settings/components/PhysicalInfoFields';
import PasswordFields from '@/screens/protected/settings/components/PasswordFields';

// Hooks
import { useProfileValidation } from '@/screens/protected/settings/hooks/useProfileValidation';
import { SubmitButton } from '@/screens/protected/settings/components/SubmitButton';

const SettingsScreen = () => {
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
        weightUnit: 'lbs',
        goal: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>('');

    const passwordStrength = getPasswordStrength(profileData.password);

    // Use validation hook
    const { errors, setErrors, validateForm, handleFieldValidation } =
        useProfileValidation(profileData);

    // Photo handling
    const handlePhotoChange = (file: File | null, preview: string) => {
        setPhotoFile(file);
        setPhotoPreview(preview);
        if (!file) {
            setProfileData((prev) => ({
                ...prev,
                photo: '',
            }));
        }
    };

    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: any) => state.auth);

    const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            if (photoPreview && photoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

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
                weightUnit: userInfo.weightUnit || 'lbs',
                goal: userInfo.goal || '',
            }));

            // Set initial photo preview from existing user photo
            if (userInfo.photo) {
                setPhotoPreview(userInfo.photo);
            }
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

        // Use validation from hook
        handleFieldValidation(name, value);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        if (
            profileData.password &&
            profileData.password !== profileData.confirmPassword
        ) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: 'Passwords do not match',
            }));
            toast.error('Passwords do not match');
            return;
        }

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

                // Convert file to base64
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

            // Clear password fields and photo file state after successful update
            setProfileData((prev) => ({
                ...prev,
                password: '',
                confirmPassword: '',
            }));

            // Clear photo file state but keep the photo URL in profileData
            setPhotoFile(null);

            // Clear the file input
            const fileInput = document.getElementById(
                'photo-input'
            ) as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
        } catch (err: string | any) {
            console.error('Profile update error:', err);
            console.error('Error details:', {
                status: err?.status,
                data: err?.data,
                message: err?.message,
                originalStatus: err?.originalStatus,
            });

            // For production debugging - show error in toast
            const errorDetails = JSON.stringify(
                {
                    status: err?.status,
                    message: err?.message || err?.data?.message,
                    type: typeof err,
                },
                null,
                2
            );
            console.log('ERROR DETAILS FOR DEBUGGING:', errorDetails);

            // Handle different types of errors
            let errorMessage = 'An error occurred';

            if (err?.status === 'FETCH_ERROR') {
                errorMessage =
                    'Unable to connect to the server. Please check your connection. (Network Error)';
            } else if (err?.status === 413) {
                errorMessage =
                    'File size too large. Please choose a smaller image (max 10MB).';
            } else if (err?.status === 400 && err?.data?.message) {
                errorMessage = err.data.message;
            } else if (err?.data?.message) {
                errorMessage = err.data.message;
            } else if (err?.message) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }

            // Add technical details in production for debugging
            if (import.meta.env.PROD) {
                errorMessage += ` [Status: ${err?.status || 'unknown'}]`;
            }

            // Handle photo upload specific errors
            if (
                errorMessage.toLowerCase().includes('photo') ||
                errorMessage.toLowerCase().includes('upload') ||
                errorMessage.toLowerCase().includes('image') ||
                errorMessage.toLowerCase().includes('file')
            ) {
                toast.error(`Photo upload failed: ${errorMessage}`, {
                    duration: 6000,
                });
            } else {
                toast.error(errorMessage, {
                    duration: 6000,
                });
            }
        }
    };

    return (
        <div className='min-h-screen relative overflow-hidden'>
            {/* Animated Background */}
            <div className='absolute inset-0 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20'>
                {/* Animated background elements */}
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
                            Profile Settings
                        </h1>
                        <p className='text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto'>
                            Keep your information up to date for the best
                            fitness experience
                        </p>
                    </div>

                    {/* Settings Form */}
                    <div className='bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl dark:hover:shadow-blue-500/10 transition-all duration-500'>
                        {/* Update Profile Form */}
                        <form
                            onSubmit={handleUpdate}
                            className='space-y-6 sm:space-y-7 lg:space-y-8'>
                            {/* Profile Picture & Goal Section */}
                            <div className='flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 p-6 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600'>
                                {/* Profile Picture */}
                                <ProfilePhotoSection
                                    photoPreview={photoPreview}
                                    photo={profileData.photo}
                                    onPhotoChange={handlePhotoChange}
                                />

                                {/* Welcome & Goal Section */}
                                <ProfileHeaderSection
                                    userName={userInfo?.name}
                                    goal={profileData.goal}
                                    onGoalChange={(value) =>
                                        handleInputChange({
                                            target: { name: 'goal', value },
                                        } as any)
                                    }
                                />
                            </div>

                            {/* Basic Info Fields */}
                            <BasicInfoFields
                                name={profileData.name}
                                username={profileData.username}
                                email={profileData.email}
                                errors={errors}
                                onChange={handleInputChange}
                            />

                            {/* Personal Info Fields */}
                            <PersonalInfoFields
                                dob={profileData.dob}
                                gender={profileData.gender}
                                errors={errors}
                                onChange={handleInputChange}
                            />

                            {/* Password Fields */}
                            <PasswordFields
                                password={profileData.password}
                                confirmPassword={profileData.confirmPassword}
                                showPassword={showPassword}
                                showConfirmPassword={showConfirmPassword}
                                errors={errors}
                                passwordStrength={passwordStrength}
                                onPasswordChange={handleInputChange}
                                onConfirmPasswordChange={handleInputChange}
                                onToggleShowPassword={() =>
                                    setShowPassword(!showPassword)
                                }
                                onToggleShowConfirmPassword={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            />

                            {/* Physical Info Fields */}
                            <PhysicalInfoFields
                                height={profileData.height}
                                weight={profileData.weight}
                                weightUnit={profileData.weightUnit}
                                errors={errors}
                                onChange={handleInputChange}
                            />

                            {/* Theme Settings Section */}
                            <ThemeSettingsSection />

                            {/* Validation Summary */}
                            {Object.values(errors).some(
                                (error) => error && error.trim() !== ''
                            ) && (
                                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl p-4'>
                                    <h4 className='text-red-700 dark:text-red-400 font-medium mb-3 flex items-center'>
                                        <svg
                                            className='w-5 h-5 mr-2 shrink-0'
                                            fill='none'
                                            stroke='currentColor'
                                            viewBox='0 0 24 24'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.73 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                                            />
                                        </svg>
                                        Please fix the following errors:
                                    </h4>
                                    <ul className='space-y-1 ml-7'>
                                        {Object.entries(errors).map(
                                            ([field, error]) =>
                                                error &&
                                                error.trim() !== '' && (
                                                    <li
                                                        key={field}
                                                        className='text-sm text-red-600 dark:text-red-300 list-disc'>
                                                        <span className='font-medium capitalize'>
                                                            {field}:
                                                        </span>{' '}
                                                        {error}
                                                    </li>
                                                )
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className='pt-6'>
                                <SubmitButton
                                    isLoading={isLoading}
                                    errors={errors}
                                    profileData={profileData}
                                />
                                <p className='text-sm text-gray-500 dark:text-gray-400 text-center mt-3'>
                                    Your information is secure and will only be
                                    used to improve your fitness experience
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
