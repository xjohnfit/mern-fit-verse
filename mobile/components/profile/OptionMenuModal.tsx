import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Alert,
    useColorScheme,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import OptionMenuModalStyles from '../../styles/profile/OptionMenuModalStyles';
import { useReportUserMutation } from '../../slices/reportsApiSlice';

interface OptionMenuModalProps {
    visible: boolean;
    userName: string;
    userId: string;
    onClose: () => void;
    onReport?: () => void;
    onBlock?: () => void;
}

export const OptionMenuModal: React.FC<OptionMenuModalProps> = ({
    visible,
    userName,
    userId,
    onClose,
    onReport,
    onBlock,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [reportUser, { isLoading: isReporting }] = useReportUserMutation();

    const handleReportUser = () => {
        onClose();
        Alert.alert(
            'Report User',
            `Why are you reporting ${userName}?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Harassment',
                    onPress: () => submitReport('harassment'),
                },
                {
                    text: 'Hate Speech',
                    onPress: () => submitReport('hate_speech'),
                },
                {
                    text: 'Spam',
                    onPress: () => submitReport('spam'),
                },
                {
                    text: 'Inappropriate Content',
                    onPress: () => submitReport('inappropriate_content'),
                },
                {
                    text: 'Violence',
                    onPress: () => submitReport('violence'),
                },
                {
                    text: 'Other',
                    onPress: () => submitReport('other'),
                },
            ],
            { cancelable: true }
        );
    };

    const submitReport = async (reason: string) => {
        try {
            const response = await reportUser({
                reportedUserId: userId,
                reason,
            }).unwrap();

            Alert.alert(
                'Success',
                response.message || 'Thank you for your report. We will review it within 24 hours.'
            );

            if (onReport) {
                onReport();
            }
        } catch (error: any) {
            Alert.alert(
                'Error',
                error?.data?.message || 'Failed to submit report. Please try again.'
            );
        }
    };

    const handleBlockUser = () => {
        onClose();
        Alert.alert(
            'Block User',
            `Are you sure you want to block ${userName}? You will no longer see their posts and they won't be able to interact with you.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Block',
                    style: 'destructive',
                    onPress: () => {
                        if (onBlock) {
                            onBlock();
                        } else {
                            // Default behavior if no handler provided
                            Alert.alert('Success', `${userName} has been blocked.`);
                        }
                    },
                },
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={OptionMenuModalStyles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View
                    style={[
                        OptionMenuModalStyles.modalContent,
                        isDark ? OptionMenuModalStyles.modalContentDark : OptionMenuModalStyles.modalContentLight,
                    ]}
                    onStartShouldSetResponder={() => true}
                >
                    {/* Report Option */}
                    <TouchableOpacity
                        style={OptionMenuModalStyles.optionButton}
                        onPress={handleReportUser}
                    >
                        <View
                            style={[
                                OptionMenuModalStyles.iconContainer,
                                isDark ? OptionMenuModalStyles.reportIconContainerDark : OptionMenuModalStyles.reportIconContainerLight,
                            ]}
                        >
                            <Ionicons name="flag-outline" size={20} color="#EF4444" />
                        </View>
                        <View style={OptionMenuModalStyles.optionTextContainer}>
                            <Text
                                style={[
                                    OptionMenuModalStyles.optionTitle,
                                    isDark ? OptionMenuModalStyles.optionTitleDark : OptionMenuModalStyles.optionTitleLight,
                                ]}
                            >
                                Report User
                            </Text>
                            <Text
                                style={[
                                    OptionMenuModalStyles.optionSubtitle,
                                    isDark ? OptionMenuModalStyles.optionSubtitleDark : OptionMenuModalStyles.optionSubtitleLight,
                                ]}
                            >
                                Report inappropriate content or behavior
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={isDark ? '#6B7280' : '#9CA3AF'}
                        />
                    </TouchableOpacity>

                    {/* Divider */}
                    <View
                        style={[
                            OptionMenuModalStyles.divider,
                            isDark ? OptionMenuModalStyles.dividerDark : OptionMenuModalStyles.dividerLight,
                        ]}
                    />

                    {/* Block Option */}
                    <TouchableOpacity
                        style={OptionMenuModalStyles.optionButton}
                        onPress={handleBlockUser}
                    >
                        <View
                            style={[
                                OptionMenuModalStyles.iconContainer,
                                isDark ? OptionMenuModalStyles.blockIconContainerDark : OptionMenuModalStyles.blockIconContainerLight,
                            ]}
                        >
                            <Ionicons name="ban-outline" size={20} color="#DC2626" />
                        </View>
                        <View style={OptionMenuModalStyles.optionTextContainer}>
                            <Text
                                style={[
                                    OptionMenuModalStyles.optionTitle,
                                    isDark ? OptionMenuModalStyles.optionTitleDark : OptionMenuModalStyles.optionTitleLight,
                                ]}
                            >
                                Block User
                            </Text>
                            <Text
                                style={[
                                    OptionMenuModalStyles.optionSubtitle,
                                    isDark ? OptionMenuModalStyles.optionSubtitleDark : OptionMenuModalStyles.optionSubtitleLight,
                                ]}
                            >
                                Stop seeing posts and interactions
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={isDark ? '#6B7280' : '#9CA3AF'}
                        />
                    </TouchableOpacity>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={[
                            OptionMenuModalStyles.cancelButton,
                            isDark ? OptionMenuModalStyles.cancelButtonDark : OptionMenuModalStyles.cancelButtonLight,
                        ]}
                        onPress={onClose}
                    >
                        <Text
                            style={[
                                OptionMenuModalStyles.cancelButtonText,
                                isDark ? OptionMenuModalStyles.cancelButtonTextDark : OptionMenuModalStyles.cancelButtonTextLight,
                            ]}
                        >
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};
