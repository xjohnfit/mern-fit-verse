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
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { apiSlice } from '../slices/apiSlice';
import { useAppDispatch } from '../hooks/useRedux';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const router = useRouter();
    const dispatch = useAppDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const handleSubmit = async () => {
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            console.log('Attempting login with:', { email });
            const res = await login({ email, password }).unwrap();
            console.log('Login successful:', res);
            // Reset API cache to ensure fresh data for the new user
            dispatch(apiSlice.util.resetApiState());
            dispatch(setCredentials({ ...res }));
            // Navigate to main app
            router.replace('/(tabs)/home' as any);
        } catch (err: any) {
            console.error('Login error:', err);
            const errorMessage = err?.data?.message || err?.message || 'Login failed. Please try again.';
            alert(`Login failed: ${errorMessage}`);
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
                <View className="flex-1 justify-center px-6 py-12">
                    {/* Header */}
                    <View className="mb-8">
                        <Text className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Welcome Back
                        </Text>
                        <Text className="text-lg text-gray-600 dark:text-gray-400">
                            Sign in to continue your fitness journey
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-6">
                        {/* Email Field */}
                        <View>
                            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Email Address
                            </Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email address"
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
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoComplete="password"
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
                        </View>

                        {/* Remember Me & Forgot Password */}
                        <View className="flex-row justify-between items-center">
                            <TouchableOpacity
                                onPress={() => setRememberMe(!rememberMe)}
                                className="flex-row items-center"
                            >
                                <View
                                    className={`w-5 h-5 border-2 rounded ${rememberMe
                                        ? 'bg-blue-600 border-blue-600'
                                        : 'border-gray-300 dark:border-gray-600'
                                        } mr-2`}
                                >
                                    {rememberMe && (
                                        <Text className="text-white text-xs text-center">✓</Text>
                                    )}
                                </View>
                                <Text className="text-sm text-gray-700 dark:text-gray-300">
                                    Remember me
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity>
                                <Text className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                    Forgot password?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isLoading}
                            className={`w-full py-4 rounded-xl ${isLoading ? 'bg-gray-400' : 'bg-blue-600'
                                } shadow-lg`}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white text-center font-semibold text-lg">
                                    Sign In
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View className="my-8 flex-row items-center">
                        <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <Text className="mx-4 text-gray-500 dark:text-gray-400 text-sm">
                            Or continue with
                        </Text>
                        <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </View>

                    {/* Social Login Buttons */}
                    <View className="flex-row justify-center space-x-4 mb-8">
                        <TouchableOpacity className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl mr-2">
                            <Text className="text-center text-gray-700 dark:text-gray-300">
                                Google
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl ml-2">
                            <Text className="text-center text-gray-700 dark:text-gray-300">
                                Facebook
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Register Link */}
                    <View className="flex-row justify-center">
                        <Text className="text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
