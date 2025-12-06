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
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { apiSlice } from '../slices/apiSlice';
import { useAppDispatch } from '../hooks/useRedux';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const router = useRouter();
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();

    const [login, { isLoading }] = useLoginMutation();

    const handleSubmit = async () => {
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const res = await login({ email, password }).unwrap();
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
        <LinearGradient
            colors={["#1e3a8a", "#3b82f6", "#60a5fa"]}
            style={{ flex: 1 }}
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
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 64 }}>
                        {/* Header */}
                        <View className="mb-12">
                            <Text className="text-4xl font-bold text-white mb-3">
                                Welcome Back
                            </Text>
                            <Text className="text-lg text-blue-100">
                                Sign in to continue your fitness journey
                            </Text>
                        </View>

                        {/* Form */}
                        <View>
                            {/* Email Field */}
                            <View className="mb-6">
                                <Text className="text-sm font-semibold text-white mb-3">
                                    Email Address
                                </Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter your email address"
                                    placeholderTextColor="#FFFFFF"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="off"
                                    multiline={false}
                                    textAlignVertical="center"
                                    style={{
                                        height: 56,
                                        width: '100%',
                                        paddingHorizontal: 20,
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        borderWidth: 1,
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                        borderRadius: 12,
                                        color: '#FFFFFF',
                                        fontSize: 16,
                                    }}
                                />
                            </View>

                            {/* Password Field */}
                            <View className="mb-6">
                                <Text className="text-sm font-semibold text-white mb-3">
                                    Password
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#FFFFFF"
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoComplete="off"
                                        textContentType="oneTimeCode"
                                        multiline={false}
                                        textAlignVertical="center"
                                        style={{
                                            height: 56,
                                            width: '100%',
                                            paddingHorizontal: 20,
                                            paddingRight: 48,
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            borderWidth: 1,
                                            borderColor: 'rgba(255, 255, 255, 0.3)',
                                            borderRadius: 12,
                                            color: '#FFFFFF',
                                            fontSize: 16,
                                        }}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: 16, top: 16 }}
                                    >
                                        <Text className="text-white text-xl">
                                            {showPassword ? <Ionicons name="eye" size={24} color="white" /> : <Ionicons name="eye-off" size={24} color="white" />}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Remember Me & Forgot Password */}
                            <View className="flex-row justify-between items-center mb-8">
                                <TouchableOpacity
                                    onPress={() => setRememberMe(!rememberMe)}
                                    className="flex-row items-center py-2"
                                >
                                    <View
                                        className={`w-5 h-5 border-2 rounded ${rememberMe ? 'bg-white border-white' : 'border-white/50'} mr-3`}
                                    >
                                        {rememberMe && (
                                            <Ionicons name="checkmark" size={14} color="#3b82f6" />
                                        )}
                                    </View>
                                    <Text className="text-sm text-white">
                                        Remember me
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity className="py-2">
                                    <Text className="text-sm text-white font-medium">
                                        Forgot password?
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={isLoading}
                                className={`w-full py-4 rounded-xl ${isLoading ? 'bg-gray-400' : 'bg-white'} shadow-lg mb-8`}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-blue-600 text-center font-semibold text-lg">
                                        Sign In
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Divider */}
                        <View className="my-10 flex-row items-center">
                            <View className="flex-1 h-px bg-white/30" />
                            <Text className="mx-5 text-white text-sm">
                                Or continue with
                            </Text>
                            <View className="flex-1 h-px bg-white/30" />
                        </View>

                        {/* Social Login Buttons */}
                        <View className="flex-row justify-center mb-10">
                            <TouchableOpacity className="flex-1 py-4 border border-white/50 rounded-xl mr-3">
                                <Text className="text-center text-white font-medium">
                                    Google
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 py-4 border border-white/50 rounded-xl ml-3">
                                <Text className="text-center text-white font-medium">
                                    Facebook
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Register Link */}
                        <View className="flex-row justify-center pt-4">
                            <Text className="text-blue-100 text-base">
                                Don't have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/register')}>
                                <Text className="text-white font-semibold text-base">
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}