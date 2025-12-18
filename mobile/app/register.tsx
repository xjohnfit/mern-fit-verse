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
import { Ionicons } from '@expo/vector-icons';
import RegisterStyles from '@/styles/auth/registerStyles';


export default function Register() {
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const styles = RegisterStyles();
    const [register, { isLoading }] = useRegisterMutation();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
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
            router.replace('/(tabs)/dashboard' as any);
        } catch (err: any) {
            alert(err?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <LinearGradient
            colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
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
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTitle}>
                                Create Account
                            </Text>
                            <Text style={styles.headerSubtitle}>
                                Join FitVerse today
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            {/* Name Field */}
                            <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>
                                    Full Name
                                </Text>
                                <TextInput
                                    value={formData.name}
                                    onChangeText={(value) => handleInputChange('name', value)}
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#FFFFFF"
                                    autoCapitalize="words"
                                    style={styles.textInput}
                                />
                            </View>

                            {/* Username Field */}
                            <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>
                                    Username
                                </Text>
                                <TextInput
                                    value={formData.username}
                                    onChangeText={(value) => handleInputChange('username', value)}
                                    placeholder="Choose a username"
                                    placeholderTextColor="#FFFFFF"
                                    autoCapitalize="none"
                                    autoComplete="off"
                                    style={styles.textInput}
                                />
                            </View>

                            {/* Email Field */}
                            <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>
                                    Email Address
                                </Text>
                                <TextInput
                                    value={formData.email}
                                    onChangeText={(value) => handleInputChange('email', value)}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#FFFFFF"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="off"
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
                                        value={formData.password}
                                        onChangeText={(value) => handleInputChange('password', value)}
                                        placeholder="Create a password"
                                        placeholderTextColor="#FFFFFF"
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        textContentType="oneTimeCode"
                                        style={styles.passwordInput}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.passwordToggle}
                                    >
                                        {showPassword ? <Ionicons name="eye" size={24} color="white" /> : <Ionicons name="eye-off" size={24} color="white" />}
                                    </TouchableOpacity>
                                </View>
                                {formData.password && (
                                    <Text style={styles.passwordStrengthText}>
                                        Password strength: {passwordStrength.text}
                                    </Text>
                                )}
                            </View>

                            {/* Confirm Password Field */}
                            <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>
                                    Confirm Password
                                </Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        value={formData.confirmPassword}
                                        onChangeText={(value) =>
                                            handleInputChange('confirmPassword', value)
                                        }
                                        placeholder="Confirm your password"
                                        placeholderTextColor="#FFFFFF"
                                        secureTextEntry={!showConfirmPassword}
                                        autoCapitalize="none"
                                        textContentType="oneTimeCode"
                                        style={styles.passwordInput}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={styles.passwordToggle}
                                    >
                                        {showConfirmPassword ? <Ionicons name="eye" size={24} color="white" /> : <Ionicons name="eye-off" size={24} color="white" />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Gender Field */}
                            <View style={styles.fieldContainer}>
                                <Text style={styles.fieldLabel}>
                                    Gender
                                </Text>
                                <View style={styles.genderRow}>
                                    {['male', 'female', 'other'].map((gender) => (
                                        <TouchableOpacity
                                            key={gender}
                                            onPress={() => handleInputChange('gender', gender)}
                                            style={[styles.genderButton, formData.gender === gender ? styles.genderButtonActive : styles.genderButtonInactive]}
                                        >
                                            <Text
                                                style={[styles.genderButtonText, formData.gender === gender ? styles.genderButtonTextActive : styles.genderButtonTextInactive]}
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
                                style={styles.termsContainer}
                            >
                                <View
                                    style={[styles.checkbox, agreeToTerms ? styles.checkboxChecked : styles.checkboxUnchecked]}
                                >
                                    {agreeToTerms && (
                                        <Ionicons name="checkmark" size={14} color="#3b82f6" />
                                    )}
                                </View>
                                <Text style={styles.termsText}>
                                    I agree to the{' '}
                                    <Text
                                        style={styles.termsLink}
                                        onPress={() => router.push('/TermsOfService')}
                                    >
                                        Terms of Service
                                    </Text>
                                    {' & '}
                                    <Text
                                        style={styles.termsLink}
                                        onPress={() => router.push('/EULA')}
                                    >
                                        EULA
                                    </Text>
                                </Text>
                            </TouchableOpacity>

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={isLoading}
                                style={[styles.submitButton, isLoading ? styles.submitButtonDisabled : styles.submitButtonActive]}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#2563EB" />
                                ) : (
                                    <Text style={styles.submitButtonText}>
                                        Create Account
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Login Link */}
                        <View style={styles.loginLinkContainer}>
                            <Text style={styles.loginText}>
                                Already have an account?{' '}
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={styles.loginLink}>
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