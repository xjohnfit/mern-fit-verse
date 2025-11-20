// Core data types
export interface ProfileData {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    dob: string;
    gender: string;
    photo: string;
    height: string;
    weight: string;
    weightUnit: string;
    goal: string;
}

export interface ValidationErrors {
    [key: string]: string;
}

export interface PasswordStrength {
    score: number;
    text: string;
    color: string;
}

// Component Props types
export interface BasicInfoFieldsProps {
    name: string;
    username: string;
    email: string;
    errors: ValidationErrors;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface PasswordFieldsProps {
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    errors: ValidationErrors;
    passwordStrength: PasswordStrength;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onToggleShowPassword: () => void;
    onToggleShowConfirmPassword: () => void;
}

export interface PersonalInfoFieldsProps {
    dob: string;
    gender: string;
    errors: ValidationErrors;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
}

export interface PhysicalInfoFieldsProps {
    height: string;
    weight: string;
    weightUnit: string;
    errors: ValidationErrors;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
}

export interface ProfileHeaderSectionProps {
    userName: string;
    goal: string;
    onGoalChange: (value: string) => void;
}

export interface ProfilePhotoSectionProps {
    photoPreview: string;
    photo: string;
    onPhotoChange: (file: File | null, preview: string) => void;
}
