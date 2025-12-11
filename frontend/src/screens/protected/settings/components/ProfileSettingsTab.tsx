import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { formatDateToInputValue } from '@/lib/formatDate';
import { getPasswordStrength } from '@/lib/getPasswordStrength';
import { useProfileValidation } from '@/screens/protected/settings/hooks/useProfileValidation';
import { lbsToKg, kgToLbs } from '@/lib/weightConversion';

import ProfilePhotoSection from '@/screens/protected/settings/components/ProfilePhotoSection';
import ProfileHeaderSection from '@/screens/protected/settings/components/ProfileHeaderSection';
import BasicInfoFields from '@/screens/protected/settings/components/BasicInfoFields';
import PersonalInfoFields from '@/screens/protected/settings/components/PersonalInfoFields';
import PhysicalInfoFields from '@/screens/protected/settings/components/PhysicalInfoFields';
import PasswordFields from '@/screens/protected/settings/components/PasswordFields';
import { SubmitButton } from '@/screens/protected/settings/components/SubmitButton';

interface ProfileSettingsTabProps {
    userInfo: any;
    isLoading: boolean;
    onUpdate: (profileData: any, photoFile: File | null) => Promise<void>;
}

const ProfileSettingsTab = ({ userInfo, isLoading, onUpdate }: ProfileSettingsTabProps) => {
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
        restTimer: 120,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>('');

    const passwordStrength = getPasswordStrength(profileData.password);

    const { errors, validateForm, handleFieldValidation } =
        useProfileValidation(profileData);

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

    useEffect(() => {
        return () => {
            if (photoPreview && photoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    useEffect(() => {
        if (userInfo) {
            // Weight is stored in lbs in the database
            // Convert to user's preferred unit for display
            const userWeightUnit = userInfo.weightUnit || 'lbs';
            let displayWeight = '';

            if (userInfo.weight) {
                if (userWeightUnit === 'kg') {
                    // Convert from lbs (database) to kg for display
                    displayWeight = lbsToKg(parseFloat(userInfo.weight)).toString();
                } else {
                    // Already in lbs, use as is
                    displayWeight = userInfo.weight;
                }
            }

            setProfileData((prev) => ({
                ...prev,
                name: userInfo.name || '',
                username: userInfo.username || '',
                email: userInfo.email || '',
                dob: formatDateToInputValue(userInfo.dob) || '',
                gender: userInfo.gender || '',
                photo: userInfo.photo || '',
                height: userInfo.height || '',
                weight: displayWeight,
                weightUnit: userWeightUnit,
                goal: userInfo.goal || '',
            }));

            if (userInfo.photo) {
                setPhotoPreview(userInfo.photo);
            }
        }
    }, [userInfo]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // Handle weight unit change - convert displayed weight to new unit
        if (name === 'weightUnit' && profileData.weight) {
            const currentWeight = parseFloat(profileData.weight);
            let convertedWeight = currentWeight;

            if (value === 'kg' && profileData.weightUnit === 'lbs') {
                // Converting from lbs to kg display
                convertedWeight = lbsToKg(currentWeight);
            } else if (value === 'lbs' && profileData.weightUnit === 'kg') {
                // Converting from kg to lbs display
                convertedWeight = kgToLbs(currentWeight);
            }

            setProfileData((prev) => ({
                ...prev,
                weightUnit: value,
                weight: convertedWeight.toString(),
            }));
            handleFieldValidation(name, value);
            return;
        }

        setProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
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
            toast.error('Passwords do not match');
            return;
        }

        await onUpdate(profileData, photoFile);

        // Clear password fields and photo file state after update
        setProfileData((prev) => ({
            ...prev,
            password: '',
            confirmPassword: '',
        }));
        setPhotoFile(null);

        const fileInput = document.getElementById('photo-input') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <form onSubmit={handleUpdate} className='space-y-6 sm:space-y-7 lg:space-y-8'>
            {/* Profile Picture & Goal Section */}
            <div className='flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 p-6 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600'>
                <ProfilePhotoSection
                    photoPreview={photoPreview}
                    photo={profileData.photo}
                    onPhotoChange={handlePhotoChange}
                />

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
                onToggleShowPassword={() => setShowPassword(!showPassword)}
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

            {/* Validation Summary */}
            {Object.values(errors).some((error) => error && error.trim() !== '') && (
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
                    Your information is secure and will only be used to improve your
                    fitness experience
                </p>
            </div>
        </form>
    );
};

export default ProfileSettingsTab;
