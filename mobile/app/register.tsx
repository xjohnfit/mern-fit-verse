import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useDispatch } from 'react-redux';
import { apiSlice } from '../slices/apiSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPasswordStrength } from '../lib/getPasswordStrength';

export default function Register() {
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const [register, { isLoading }] = useRegisterMutation();

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

    const passwordStrength = getPasswordStrength(formData.password);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        if (
            !formData.name ||
            !formData.username ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            alert('Please fill in all required fields');
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
            router.replace('/(tabs)/home' as any);
        } catch (err: any) {
            alert(err?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <LinearGradient
            colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
            className="flex-1"
        >
            <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
            <View style={{ height: insets.top }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: insets.bottom,
                    }}
                >
                    <View className="flex-1 px-6 py-12">
                        {/* Header */}
                        <View className="items-center mb-8">
                            <Text className="text-4xl font-bold text-white mb-2">
                                Create Account
                            </Text>
                            <Text className="text-lg text-blue-100">
                                Join FitVerse today
                            </Text>
                        </View>

                        {/* Form */}
                        <View className="gap-4">
                            {/* Name Field */}
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-white mb-2">
                                    Full Name
                                </Text>
                                <TextInput
                                    value={formData.name}
                                    onChangeText={(value) => handleInputChange('name', value)}
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="words"
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white text-base"
                                />
                            </View>

                            {/* Username Field */}
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-white mb-2">
                                    Username
                                </Text>
                                <TextInput
                                    value={formData.username}
                                    onChangeText={(value) => handleInputChange('username', value)}
                                    placeholder="Choose a username"
                                    placeholderTextColor="#9CA3AF"
                                    autoCapitalize="none"
                                    autoComplete="username"
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white text-base"
                                />
                            </View>

                            {/* Email Field */}
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-white mb-2">
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
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white text-base"
                                />
                            </View>

                            {/* Password Field */}
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-white mb-2">
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
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white text-base"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3"
                                    >
                                        <Text className="text-white text-lg">
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                {formData.password && (
                                    <Text
                                        className="text-xs mt-1"
                                        style={{
                                            color: passwordStrength.color === 'text-red-500' ? '#EF4444' :
                                                passwordStrength.color === 'text-yellow-500' ? '#EAB308' :
                                                    passwordStrength.color === 'text-blue-500' ? '#3B82F6' : '#10B981'
                                        }}
                                    >
                                        Password strength: {passwordStrength.text}
                                    </Text>
                                )}
                            </View>

                            {/* Confirm Password Field */}
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-white mb-2">
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
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white text-base"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-3"
                                    >
                                        <Text className="text-white text-lg">
                                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Date of Birth Field */}
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-white mb-2">
                                    Date of Birth
                                </Text>
                                <TextInput
                                    value={formData.dob}
                                    onChangeText={(value) => handleInputChange('dob', value)}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor="#9CA3AF"
                                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white text-base"
                                />
                            </View>

                            {/* Gender Field */}
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-white mb-2">
                                    Gender
                                </Text>
                                <View className="flex-row gap-2">
                                    {['male', 'female', 'other'].map((gender) => (
                                        <TouchableOpacity
                                            key={gender}
                                            onPress={() => handleInputChange('gender', gender)}
                                            className="flex-1 py-3 rounded-xl border"
                                            style={{
                                                backgroundColor: formData.gender === gender ? 'white' : 'transparent',
                                                borderColor: formData.gender === gender ? 'white' : 'rgba(255,255,255,0.5)'
                                            }}
                                        >
                                            <Text
                                                className="text-center capitalize text-base"
                                                style={{
                                                    color: formData.gender === gender ? '#2563EB' : 'white',
                                                    fontWeight: formData.gender === gender ? '600' : 'normal'
                                                }}
                                            >
                                                {gender.charAt(0).toUpperCase() + gender.slice(1)}
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
                                    className="w-5 h-5 border-2 rounded items-center justify-center mr-2"
                                    style={{
                                        backgroundColor: agreeToTerms ? 'white' : 'transparent',
                                        borderColor: agreeToTerms ? 'white' : 'rgba(255,255,255,0.5)'
                                    }}
                                >
                                    {agreeToTerms && (
                                        <Text className="text-blue-600 text-sm font-bold">✓</Text>
                                    )}
                                </View>
                                <Text className="text-sm text-white">
                                    I agree to the{' '}
                                    <Text className="font-semibold">Terms and Conditions</Text>
                                </Text>
                            </TouchableOpacity>

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl mt-6 items-center"
                                style={{ backgroundColor: isLoading ? '#9CA3AF' : 'white' }}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#2563EB" />
                                ) : (
                                    <Text className="text-blue-600 text-center font-semibold text-lg">
                                        Create Account
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Login Link */}
                        <View className="flex-row justify-center mt-8">
                            <Text className="text-blue-100 text-base">
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text className="text-white font-semibold text-base">
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}