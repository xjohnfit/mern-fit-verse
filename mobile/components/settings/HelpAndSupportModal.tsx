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
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import HelpAndSupportModalStyles from '@/styles/settings/HelpAndSupportModalStyles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface HelpAndSupportModalProps {
    visible: boolean;
    onClose: () => void;
    userFullName: string;
    userEmail: string;
}

const HelpAndSupportModal: React.FC<HelpAndSupportModalProps> = ({
    visible,
    onClose,
    userFullName,
    userEmail,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = HelpAndSupportModalStyles(isDark);

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
                text2: 'We\'ll get back to you soon',
            });

            setMessage('');
            onClose();
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

    const handleClose = () => {
        if (!isSending) {
            setMessage('');
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleClose}
                    style={styles.backdropTouchable}
                />
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.headerIconContainer}>
                                <Ionicons
                                    name="mail"
                                    size={22}
                                    color={isDark ? '#FFFFFF' : '#3B82F6'}
                                />
                            </View>
                            <View>
                                <Text style={styles.headerTitle}>
                                    Help & Support
                                </Text>
                                <Text style={styles.headerSubtitle}>
                                    Send us a message
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={handleClose}
                            disabled={isSending}
                            style={styles.closeButton}
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
                            <Text style={styles.fieldLabel}>
                                Full Name
                            </Text>
                            <View style={styles.disabledField}>
                                <Text style={styles.disabledFieldText}>
                                    {userFullName}
                                </Text>
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.fieldContainer}>
                            <Text style={styles.fieldLabel}>
                                Email
                            </Text>
                            <View style={styles.disabledField}>
                                <Text style={styles.disabledFieldText}>
                                    {userEmail}
                                </Text>
                            </View>
                        </View>

                        {/* Message */}
                        <View style={styles.messageContainer}>
                            <Text style={styles.fieldLabel}>
                                Message *
                            </Text>
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Describe your issue or question..."
                                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                                multiline
                                numberOfLines={8}
                                textAlignVertical="top"
                                editable={!isSending}
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
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default HelpAndSupportModal;

