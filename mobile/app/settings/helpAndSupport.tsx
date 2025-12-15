// React
import React, { useState } from 'react';

// React Native
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    useColorScheme,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';

// Expo
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Third-party
import Toast from 'react-native-toast-message';

// Hooks
import { useAppSelector } from '@/hooks/useRedux';

// Styles
import HelpAndSupportStyles from '@/styles/settings/HelpAndSupportStyles';

const HelpAndSupportScreen = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = HelpAndSupportStyles(isDark);
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { userInfo } = useAppSelector((state) => state.auth);

    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSendEmail = async () => {
        if (!message.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Message Required',
                text2: 'Please enter a message before sending',
            });
            return;
        }

        setIsSending(true);

        try {
            // TODO: Implement email sending logic here
            // You can use a backend endpoint that sends emails or a third-party service

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            Toast.show({
                type: 'success',
                text1: 'Message Sent!',
                text2: "We'll get back to you soon",
            });

            setMessage('');
            router.back();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Send Failed',
                text2: 'Failed to send message. Please try again.',
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top }]}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        disabled={isSending}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Help & Support</Text>
                    </View>
                    <View style={styles.headerRight} />
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Info Banner */}
                    <View style={styles.infoCard}>
                        <Ionicons
                            name="information-circle"
                            size={24}
                            color={isDark ? '#60A5FA' : '#3B82F6'}
                            style={styles.infoIcon}
                        />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoText}>
                                We typically respond within 24-48 hours.
                            </Text>
                        </View>
                    </View>

                    {/* Full Name */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Full Name</Text>
                        <View style={styles.disabledField}>
                            <Text style={styles.disabledFieldText}>
                                {userInfo?.name || 'N/A'}
                            </Text>
                        </View>
                    </View>

                    {/* Email */}
                    <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Email</Text>
                        <View style={styles.disabledField}>
                            <Text style={styles.disabledFieldText}>
                                {userInfo?.email || 'N/A'}
                            </Text>
                        </View>
                    </View>

                    {/* Message */}
                    <View style={styles.messageContainer}>
                        <Text style={styles.fieldLabel}>Message *</Text>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Describe your issue or question..."
                            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                            multiline
                            numberOfLines={8}
                            textAlignVertical="top"
                            editable={!isSending}
                            maxLength={1000}
                            style={styles.textInput}
                        />
                        <Text style={styles.characterCount}>
                            {message.length} / 1000 characters
                        </Text>
                    </View>

                    {/* Send Button */}
                    <TouchableOpacity
                        onPress={handleSendEmail}
                        disabled={isSending || !message.trim()}
                        style={
                            isSending || !message.trim()
                                ? styles.sendButtonDisabled
                                : styles.sendButton
                        }
                        activeOpacity={0.8}
                    >
                        {isSending ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Ionicons name="send" size={20} color="#FFFFFF" />
                        )}
                        <Text
                            style={
                                isSending || !message.trim()
                                    ? styles.sendButtonTextDisabled
                                    : styles.sendButtonText
                            }
                        >
                            {isSending ? 'Sending...' : 'Send Message'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
};

export default HelpAndSupportScreen;
