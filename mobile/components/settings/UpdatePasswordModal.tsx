import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    useColorScheme,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useUpdatePasswordMutation } from '@/slices/usersApiSlice';
import styles from '@/styles/settings/UpdatePasswordModalStyles';

interface UpdatePasswordModalProps {
    visible: boolean;
    onClose: () => void;
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({
    visible,
    onClose,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

    const handleClose = () => {
        if (!isLoading) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
            onClose();
        }
    };

    const validatePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Missing Fields',
                text2: 'Please fill in all password fields',
            });
            return false;
        }

        if (newPassword.length < 8) {
            Toast.show({
                type: 'error',
                text1: 'Password Too Short',
                text2: 'New password must be at least 8 characters',
            });
            return false;
        }

        if (newPassword !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Passwords Don\'t Match',
                text2: 'New password and confirmation must match',
            });
            return false;
        }

        if (currentPassword === newPassword) {
            Toast.show({
                type: 'error',
                text1: 'Same Password',
                text2: 'New password must be different from current password',
            });
            return false;
        }

        return true;
    };

    const handleUpdatePassword = async () => {
        if (!validatePassword()) {
            return;
        }

        try {
            await updatePassword({
                currentPassword,
                newPassword,
            }).unwrap();

            Toast.show({
                type: 'success',
                text1: 'Password Updated',
                text2: 'Your password has been changed successfully',
            });

            handleClose();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: error?.data?.message || 'Failed to update password',
            });
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleClose}
                    style={styles.backdrop}
                />
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                    style={[styles.modalContainer, isDark && styles.modalContainerDark]}
                >
                    {/* Header */}
                    <View style={[styles.header, isDark && styles.headerDark]}>
                        <View style={styles.headerLeft}>
                            <View style={[styles.headerIcon, isDark && styles.headerIconDark]}>
                                <Ionicons
                                    name="lock-closed"
                                    size={22}
                                    color={isDark ? '#FFFFFF' : '#3B82F6'}
                                />
                            </View>
                            <View style={styles.headerTextContainer}>
                                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
                                    Update Password
                                </Text>
                                <Text style={[styles.headerSubtitle, isDark && styles.headerSubtitleDark]}>
                                    Change your account password
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={handleClose}
                            disabled={isLoading}
                            style={[styles.closeButton, isDark && styles.closeButtonDark]}
                        >
                            <Ionicons
                                name="close"
                                size={20}
                                color={isDark ? '#9CA3AF' : '#6B7280'}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollViewContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Security Notice */}
                        <View style={[styles.securityNotice, isDark && styles.securityNoticeDark]}>
                            <Ionicons
                                name="shield-checkmark"
                                size={24}
                                color={isDark ? '#60A5FA' : '#3B82F6'}
                                style={styles.securityNoticeIcon}
                            />
                            <View style={styles.securityNoticeTextContainer}>
                                <Text style={[styles.securityNoticeText, isDark && styles.securityNoticeTextDark]}>
                                    For your security, make sure your new password is at least 8
                                    characters long and different from your current password.
                                </Text>
                            </View>
                        </View>

                        {/* Current Password */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                                Current Password *
                            </Text>
                            <View style={[styles.inputWrapper, isDark && styles.inputWrapperDark]}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color={isDark ? '#9CA3AF' : '#6B7280'}
                                />
                                <TextInput
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    placeholder="Enter current password"
                                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                                    secureTextEntry={!showCurrentPassword}
                                    editable={!isLoading}
                                    style={[styles.input, isDark && styles.inputDark]}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    <Ionicons
                                        name={showCurrentPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={isDark ? '#9CA3AF' : '#6B7280'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* New Password */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                                New Password *
                            </Text>
                            <View style={[styles.inputWrapper, isDark && styles.inputWrapperDark]}>
                                <Ionicons
                                    name="key-outline"
                                    size={20}
                                    color={isDark ? '#9CA3AF' : '#6B7280'}
                                />
                                <TextInput
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    placeholder="Enter new password"
                                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                                    secureTextEntry={!showNewPassword}
                                    editable={!isLoading}
                                    style={[styles.input, isDark && styles.inputDark]}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                >
                                    <Ionicons
                                        name={showNewPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={isDark ? '#9CA3AF' : '#6B7280'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.inputHint, isDark && styles.inputHintDark]}>
                                Minimum 8 characters
                            </Text>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputContainerLast}>
                            <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
                                Confirm New Password *
                            </Text>
                            <View style={[styles.inputWrapper, isDark && styles.inputWrapperDark]}>
                                <Ionicons
                                    name="checkmark-circle-outline"
                                    size={20}
                                    color={isDark ? '#9CA3AF' : '#6B7280'}
                                />
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Confirm new password"
                                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                                    secureTextEntry={!showConfirmPassword}
                                    editable={!isLoading}
                                    style={[styles.input, isDark && styles.inputDark]}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Ionicons
                                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={isDark ? '#9CA3AF' : '#6B7280'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Update Button */}
                        <TouchableOpacity
                            onPress={handleUpdatePassword}
                            disabled={isLoading}
                            style={[
                                styles.updateButton,
                                isLoading && (isDark ? styles.updateButtonDisabledDark : styles.updateButtonDisabled)
                            ]}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                            )}
                            <Text
                                style={[
                                    styles.updateButtonText,
                                    isLoading && (isDark ? styles.updateButtonTextDisabledDark : styles.updateButtonTextDisabled)
                                ]}
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default UpdatePasswordModal;

