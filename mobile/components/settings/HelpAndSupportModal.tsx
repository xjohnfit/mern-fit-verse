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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

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
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'flex-end',
                }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleClose}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
                <View
                    style={{
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        height: SCREEN_HEIGHT * 0.9,
                        paddingTop: 16,
                    }}
                >
                    {/* Header */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingHorizontal: 20,
                                paddingBottom: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: isDark ? '#374151' : '#E5E7EB',
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                <View
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 20,
                                        backgroundColor: isDark ? '#3B82F6' : '#DBEAFE',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Ionicons
                                        name="mail"
                                        size={22}
                                        color={isDark ? '#FFFFFF' : '#3B82F6'}
                                    />
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 'bold',
                                            color: isDark ? '#F9FAFB' : '#111827',
                                        }}
                                    >
                                        Help & Support
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: isDark ? '#9CA3AF' : '#6B7280',
                                            marginTop: 2,
                                        }}
                                    >
                                        Send us a message
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={handleClose}
                                disabled={isSending}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor: isDark ? '#374151' : '#F3F4F6',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
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
                            style={{ flex: 1 }}
                            contentContainerStyle={{ padding: 20 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Info Banner */}
                            <View
                                style={{
                                    backgroundColor: isDark ? '#1E3A8A' : '#EFF6FF',
                                    borderRadius: 12,
                                    padding: 16,
                                    marginBottom: 20,
                                    flexDirection: 'row',
                                    gap: 12,
                                }}
                            >
                                <Ionicons
                                    name="information-circle"
                                    size={24}
                                    color={isDark ? '#60A5FA' : '#3B82F6'}
                                    style={{ marginTop: 2 }}
                                />
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: isDark ? '#BFDBFE' : '#1E40AF',
                                        }}
                                    >
                                        We typically respond within 24-48 hours.
                                    </Text>
                                </View>
                            </View>

                            {/* Full Name */}
                            <View style={{ marginBottom: 16 }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: isDark ? '#F9FAFB' : '#374151',
                                        marginBottom: 8,
                                    }}
                                >
                                    Full Name
                                </Text>
                                <View
                                    style={{
                                        backgroundColor: isDark ? '#374151' : '#F9FAFB',
                                        borderRadius: 12,
                                        padding: 16,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            color: isDark ? '#D1D5DB' : '#6B7280',
                                        }}
                                    >
                                        {userFullName}
                                    </Text>
                                </View>
                            </View>

                            {/* Email */}
                            <View style={{ marginBottom: 16 }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: isDark ? '#F9FAFB' : '#374151',
                                        marginBottom: 8,
                                    }}
                                >
                                    Email
                                </Text>
                                <View
                                    style={{
                                        backgroundColor: isDark ? '#374151' : '#F9FAFB',
                                        borderRadius: 12,
                                        padding: 16,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            color: isDark ? '#D1D5DB' : '#6B7280',
                                        }}
                                    >
                                        {userEmail}
                                    </Text>
                                </View>
                            </View>

                            {/* Message */}
                            <View style={{ marginBottom: 20 }}>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: isDark ? '#F9FAFB' : '#374151',
                                        marginBottom: 8,
                                    }}
                                >
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
                                    style={{
                                        backgroundColor: isDark ? '#374151' : '#FFFFFF',
                                        borderRadius: 12,
                                        padding: 16,
                                        fontSize: 15,
                                        color: isDark ? '#F9FAFB' : '#111827',
                                        minHeight: 150,
                                        borderWidth: 1,
                                        borderColor: isDark ? '#4B5563' : '#E5E7EB',
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: isDark ? '#6B7280' : '#9CA3AF',
                                        marginTop: 6,
                                    }}
                                >
                                    {message.length} / 1000 characters
                                </Text>
                            </View>

                            {/* Send Button */}
                            <TouchableOpacity
                                onPress={handleSendEmail}
                                disabled={isSending || !message.trim()}
                                style={{
                                    backgroundColor:
                                        isSending || !message.trim()
                                            ? isDark
                                                ? '#374151'
                                                : '#E5E7EB'
                                            : '#3B82F6',
                                    borderRadius: 12,
                                    padding: 16,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                }}
                                activeOpacity={0.8}
                            >
                                {isSending ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Ionicons name="send" size={20} color="#FFFFFF" />
                                )}
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        color:
                                            isSending || !message.trim()
                                                ? isDark
                                                    ? '#6B7280'
                                                    : '#9CA3AF'
                                                : '#FFFFFF',
                                    }}
                                >
                                    {isSending ? 'Sending...' : 'Send Message'}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
        </Modal>
    );
};

export default HelpAndSupportModal;

