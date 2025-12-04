import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { apiSlice } from '../slices/apiSlice';
import { useAppDispatch } from '../hooks/useRedux';

export default function RegisterScreen() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        gender: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const router = useRouter();
    const dispatch = useAppDispatch();

    const [register, { isLoading }] = useRegisterMutation();

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;

        if (strength === 0) return { text: '', color: '' };
        if (strength <= 2) return { text: 'Weak', color: 'text-red-500' };
        if (strength <= 3) return { text: 'Fair', color: 'text-yellow-500' };
        if (strength <= 4) return { text: 'Good', color: 'text-blue-500' };
        return { text: 'Strong', color: 'text-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    const handleSubmit = async () => {
        // Basic validation
        if (
            !formData.name ||
            !formData.username ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.dob ||
            !formData.gender
        ) {
            alert('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (!agreeToTerms) {
            alert('Please agree to the terms and conditions');
            return;
        }

        try {
            const { confirmPassword, ...registerData } = formData;
            const res = await register(registerData).unwrap();
            dispatch(apiSlice.util.resetApiState());
            dispatch(setCredentials({ ...res }));
            // Navigate to main app
            router.replace('/(tabs)/home' as any);
        } catch (err: any) {
            alert(err?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white dark:bg-gray-900"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 px-6 py-12">
                    {/* Header */}
                    <View className="mb-8">
                        <Text className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Create Account
                        </Text>
                        <Text className="text-lg text-gray-600 dark:text-gray-400">
                            Start your fitness journey today
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-4">
                        {/* Name Field */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Full Name
                            </Text>
                            <TextInput
                                value={formData.name}
                                onChangeText={(value) => handleInputChange('name', value)}
                                placeholder="Enter your full name"
                                placeholderTextColor="#9CA3AF"
                                autoCapitalize="words"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                            />
                        </View>

                        {/* Username Field */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Username
                            </Text>
                            <TextInput
                                value={formData.username}
                                onChangeText={(value) => handleInputChange('username', value)}
                                placeholder="Choose a username"
                                placeholderTextColor="#9CA3AF"
                                autoCapitalize="none"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                            />
                        </View>

                        {/* Email Field */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </Text>
                            <TextInput
                                value={formData.email}
                                onChangeText={(value) => handleInputChange('email', value)}
                                placeholder="Enter your email"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                            />
                        </View>

                        {/* Password Field */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </Text>
                            <View className="relative">
                                <TextInput
                                    value={formData.password}
                                    onChangeText={(value) => handleInputChange('password', value)}
                                    placeholder="Create a password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3"
                                >
                                    <Text className="text-gray-400">
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {formData.password && (
                                <Text className={`text-xs mt-1 ${passwordStrength.color}`}>
                                    Password strength: {passwordStrength.text}
                                </Text>
                            )}
                        </View>

                        {/* Confirm Password Field */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Confirm Password
                            </Text>
                            <View className="relative">
                                <TextInput
                                    value={formData.confirmPassword}
                                    onChangeText={(value) =>
                                        handleInputChange('confirmPassword', value)
                                    }
                                    placeholder="Confirm your password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-3"
                                >
                                    <Text className="text-gray-400">
                                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Date of Birth Field */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Date of Birth
                            </Text>
                            <TextInput
                                value={formData.dob}
                                onChangeText={(value) => handleInputChange('dob', value)}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#9CA3AF"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                            />
                        </View>

                        {/* Gender Field */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Gender
                            </Text>
                            <View className="flex-row space-x-2">
                                {['male', 'female', 'other'].map((gender) => (
                                    <TouchableOpacity
                                        key={gender}
                                        onPress={() => handleInputChange('gender', gender)}
                                        className={`flex-1 py-3 rounded-xl border ${formData.gender === gender
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <Text
                                            className={`text-center capitalize ${formData.gender === gender
                                                    ? 'text-white'
                                                    : 'text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {gender}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Terms and Conditions */}
                        <TouchableOpacity
                            onPress={() => setAgreeToTerms(!agreeToTerms)}
                            className="flex-row items-center mt-4"
                        >
                            <View
                                className={`w-5 h-5 border-2 rounded ${agreeToTerms
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'border-gray-300 dark:border-gray-600'
                                    } mr-2`}
                            >
                                {agreeToTerms && (
                                    <Text className="text-white text-xs text-center">✓</Text>
                                )}
                            </View>
                            <Text className="text-sm text-gray-700 dark:text-gray-300">
                                I agree to the{' '}
                                <Text className="text-blue-600 dark:text-blue-400">
                                    Terms and Conditions
                                </Text>
                            </Text>
                        </TouchableOpacity>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl mt-6 ${isLoading ? 'bg-gray-400' : 'bg-blue-600'
                                } shadow-lg`}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-semibold text-lg">
                                    Create Account
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Login Link */}
                    <View className="flex-row justify-center mt-8">
                        <Text className="text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
