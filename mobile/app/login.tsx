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
import LoginStyles from '@/styles/auth/loginStyles';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const router = useRouter();
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const styles = LoginStyles();

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
            router.replace('/(tabs)/dashboard' as any);
        } catch (err: any) {
            const errorMessage = err?.data?.message || err?.message || 'Login failed. Please try again.';
            alert(errorMessage);
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
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTitle}>
                                Welcome Back
                            </Text>
                            <Text style={styles.headerSubtitle}>
                                Sign in to continue your fitness journey
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            {/* Email Field */}
                            <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>
                                    Email Address
                                </Text>
                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter your email address"
                                    placeholderTextColor="#FFFFFF"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    textContentType="emailAddress"
                                    autoCorrect={false}
                                    multiline={false}
                                    textAlignVertical="center"
                                    style={styles.textInput}
                                />
                            </View>

                            {/* Password Field */}
                            <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>
                                    Password
                                </Text>
                                <View style={styles.passwordContainer}>
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
                                        style={styles.passwordInput}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.passwordToggle}
                                    >
                                        {showPassword ? <Ionicons name="eye" size={24} color="white" /> : <Ionicons name="eye-off" size={24} color="white" />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Remember Me & Forgot Password */}
                            <View style={styles.rememberForgotRow}>
                                <TouchableOpacity
                                    onPress={() => setRememberMe(!rememberMe)}
                                    style={styles.rememberMeContainer}
                                >
                                    <View
                                        style={[styles.checkbox, rememberMe ? styles.checkboxChecked : styles.checkboxUnchecked]}
                                    >
                                        {rememberMe && (
                                            <Ionicons name="checkmark" size={14} color="#3b82f6" />
                                        )}
                                    </View>
                                    <Text style={styles.rememberText}>
                                        Remember me
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.forgotButton}>
                                    <Text style={styles.forgotText}>
                                        Forgot password?
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={isLoading}
                                style={[styles.submitButton, isLoading ? styles.submitButtonDisabled : styles.submitButtonActive]}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#2563eb" />
                                ) : (
                                    <Text style={styles.submitButtonText}>
                                        Sign In
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Divider */}
                        {/* <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>
                                Or continue with
                            </Text>
                            <View style={styles.dividerLine} />
                        </View> */}

                        {/* Social Login Buttons */}
                        {/* <View style={styles.socialButtonsRow}>
                            <TouchableOpacity style={[styles.socialButton, styles.socialButtonLeft]}>
                                <Text style={styles.socialButtonText}>
                                    Google
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.socialButton, styles.socialButtonRight]}>
                                <Text style={styles.socialButtonText}>
                                    Facebook
                                </Text>
                            </TouchableOpacity>
                        </View> */}

                        {/* Register Link */}
                        <View style={styles.registerLinkContainer}>
                            <Text style={styles.registerText}>
                                Don't have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/register')}>
                                <Text style={styles.registerLink}>
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