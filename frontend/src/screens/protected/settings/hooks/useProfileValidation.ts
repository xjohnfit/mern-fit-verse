import { useState } from 'react';

interface ProfileData {
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
    goal: string;
}

export const useProfileValidation = (profileData: ProfileData) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateField = (
        name: string,
        value: any,
        currentPasswordValue?: string
    ) => {
        let error = '';

        switch (name) {
            case 'name':
                const nameValue = value as string;
                if (!nameValue.trim()) {
                    error = 'Name is required';
                } else if (nameValue.trim().length < 2) {
                    error = 'Name must be at least 2 characters';
                } else if (nameValue.trim().length > 50) {
                    error = 'Name must be less than 50 characters';
                } else if (!/^[a-zA-Z\s]+$/.test(nameValue.trim())) {
                    error = 'Name can only contain letters and spaces';
                }
                break;

            case 'username':
                const usernameValue = value as string;
                if (!usernameValue.trim()) {
                    error = 'Username is required';
                } else if (usernameValue.length < 3) {
                    error = 'Username must be at least 3 characters';
                } else if (usernameValue.length > 20) {
                    error = 'Username must be less than 20 characters';
                } else if (!/^[a-zA-Z0-9_]+$/.test(usernameValue)) {
                    error =
                        'Username can only contain letters, numbers, and underscores';
                } else if (/^\d+$/.test(usernameValue)) {
                    error = 'Username cannot be only numbers';
                }
                break;

            case 'email':
                const emailValue = value as string;
                if (!emailValue.trim()) {
                    error = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                    error = 'Please enter a valid email address';
                } else if (emailValue.length > 254) {
                    error = 'Email address is too long';
                }
                break;

            case 'password':
                const passwordValue = value as string;
                if (passwordValue) {
                    // Only validate if password is provided (it's optional for updates)
                    if (passwordValue.length < 8) {
                        error = 'Password must be at least 8 characters';
                    } else if (passwordValue.length > 128) {
                        error = 'Password must be less than 128 characters';
                    } else if (!/(?=.*[a-z])/.test(passwordValue)) {
                        error =
                            'Password must contain at least one lowercase letter';
                    } else if (!/(?=.*[A-Z])/.test(passwordValue)) {
                        error =
                            'Password must contain at least one uppercase letter';
                    } else if (!/(?=.*\d)/.test(passwordValue)) {
                        error = 'Password must contain at least one number';
                    } else if (!/(?=.*[@$!%*?&])/.test(passwordValue)) {
                        error =
                            'Password must contain at least one special character (@$!%*?&)';
                    } else if (/\s/.test(passwordValue)) {
                        error = 'Password cannot contain spaces';
                    }
                }
                break;

            case 'confirmPassword':
                const confirmPasswordValue = value as string;
                const currentPassword =
                    currentPasswordValue || profileData.password;
                if (currentPassword && !confirmPasswordValue) {
                    error = 'Please confirm your password';
                } else if (
                    confirmPasswordValue &&
                    confirmPasswordValue !== currentPassword
                ) {
                    error = 'Passwords do not match';
                }
                break;

            case 'dob':
                const dobValue = value as string;
                if (dobValue) {
                    const today = new Date();
                    const birthDate = new Date(dobValue);
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();

                    if (
                        monthDiff < 0 ||
                        (monthDiff === 0 &&
                            today.getDate() < birthDate.getDate())
                    ) {
                        age--;
                    }

                    if (birthDate >= today) {
                        error = 'Date of birth cannot be in the future';
                    } else if (age < 13) {
                        error = 'You must be at least 13 years old';
                    } else if (age > 120) {
                        error = 'Please enter a valid date of birth';
                    }
                }
                break;

            case 'height':
                const heightValue = Number(value);
                if (value && (heightValue < 50 || heightValue > 300)) {
                    error = 'Height must be between 50 and 300 cm';
                }
                break;

            case 'weight':
                const weightValue = Number(value);
                if (value && (weightValue < 20 || weightValue > 500)) {
                    error = 'Weight must be between 20 and 500 kg';
                }
                break;

            default:
                break;
        }

        return error;
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const requiredFields = ['name', 'username', 'email'];

        requiredFields.forEach((field) => {
            const error = validateField(
                field,
                profileData[field as keyof typeof profileData]
            );
            if (error) {
                newErrors[field] = error;
            }
        });

        // Validate password if provided
        if (profileData.password) {
            const passwordError = validateField(
                'password',
                profileData.password
            );
            if (passwordError) {
                newErrors.password = passwordError;
            }

            const confirmPasswordError = validateField(
                'confirmPassword',
                profileData.confirmPassword
            );
            if (confirmPasswordError) {
                newErrors.confirmPassword = confirmPasswordError;
            }
        }

        // Validate optional fields if they have values
        ['dob', 'height', 'weight'].forEach((field) => {
            const value = profileData[field as keyof typeof profileData];
            if (value) {
                const error = validateField(field, value);
                if (error) {
                    newErrors[field] = error;
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFieldValidation = (name: string, value: any) => {
        // Real-time validation - always validate when there's an error or when field has value
        if (errors[name] || value.trim() !== '') {
            const error = validateField(name, value);
            if (error) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: error,
                }));
            } else {
                // Clear error if validation passes
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        } else if (errors[name] && value.trim() === '') {
            // Clear error when field is empty (for optional fields)
            const requiredFields = ['name', 'username', 'email'];
            if (!requiredFields.includes(name)) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }
        }

        // Special handling for password changes - also validate confirm password
        if (name === 'password') {
            // Re-validate confirm password if it has a value or error
            if (errors.confirmPassword || profileData.confirmPassword) {
                const confirmError = validateField(
                    'confirmPassword',
                    profileData.confirmPassword,
                    value
                );
                if (confirmError) {
                    setErrors((prev) => ({
                        ...prev,
                        confirmPassword: confirmError,
                    }));
                } else {
                    setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.confirmPassword;
                        return newErrors;
                    });
                }
            }
        }
    };

    return {
        errors,
        setErrors,
        validateField,
        validateForm,
        handleFieldValidation,
    };
};
