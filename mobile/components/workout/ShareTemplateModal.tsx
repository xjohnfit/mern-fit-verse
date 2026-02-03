import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList,
    ActivityIndicator,
    useColorScheme,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useGetFollowingQuery } from '@/slices/usersApiSlice';
import { useShareTemplateMutation } from '@/slices/messageApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import type { WorkoutTemplate } from '@/types/workout.types';

interface ShareTemplateModalProps {
    visible: boolean;
    template: WorkoutTemplate | null;
    onClose: () => void;
}

interface User {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

export const ShareTemplateModal: React.FC<ShareTemplateModalProps> = ({
    visible,
    template,
    onClose,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { data: followingData, isLoading } = useGetFollowingQuery(userInfo?._id || '');
    const [shareTemplate, { isLoading: isSharing }] = useShareTemplateMutation();

    const following = followingData || [];

    const filteredUsers = following.filter(
        (user: User) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleUser = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleShare = async () => {
        if (!template || !userInfo || selectedUsers.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Selection Required',
                text2: 'Please select at least one user',
            });
            return;
        }

        try {
            for (const userId of selectedUsers) {
                await shareTemplate({
                    senderId: userInfo._id,
                    receiverId: userId,
                    templateId: template._id,
                }).unwrap();
            }

            Toast.show({
                type: 'success',
                text1: 'Template Shared',
                text2: `Successfully shared with ${selectedUsers.length} ${selectedUsers.length === 1 ? 'user' : 'users'}`,
            });

            setSelectedUsers([]);
            setSearchQuery('');
            onClose();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Share Failed',
                text2: error?.data?.message || 'Failed to share template',
            });
        }
    };

    const handleClose = () => {
        setSelectedUsers([]);
        setSearchQuery('');
        onClose();
    };

    const renderUser = ({ item }: { item: User; }) => {
        const isSelected = selectedUsers.includes(item._id);

        return (
            <TouchableOpacity
                style={styles.userItem}
                onPress={() => toggleUser(item._id)}
                activeOpacity={0.7}
            >
                <View style={styles.userInfo}>
                    {item.photo ? (
                        <Image source={{ uri: item.photo }} style={styles.userPhoto} />
                    ) : (
                        <View style={[styles.userPhoto, styles.userPhotoPlaceholder]}>
                            <Ionicons name="person" size={24} color={isDark ? '#64748b' : '#9ca3af'} />
                        </View>
                    )}
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userUsername}>@{item.username}</Text>
                    </View>
                </View>
                <View
                    style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                    ]}
                >
                    {isSelected && <Ionicons name="checkmark" size={18} color="#fff" />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Share Template</Text>
                            {template && (
                                <Text style={styles.subtitle}>{template.name}</Text>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.closeButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="close" size={24} color={isDark ? '#94a3b8' : '#6b7280'} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color={isDark ? '#64748b' : '#9ca3af'} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search users..."
                            placeholderTextColor={isDark ? '#64748b' : '#9ca3af'}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {selectedUsers.length > 0 && (
                        <View style={styles.selectedContainer}>
                            <Text style={styles.selectedText}>
                                {selectedUsers.length} {selectedUsers.length === 1 ? 'user' : 'users'} selected
                            </Text>
                        </View>
                    )}

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#9333ea" />
                            <Text style={styles.loadingText}>Loading users...</Text>
                        </View>
                    ) : filteredUsers.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="people-outline" size={48} color={isDark ? '#475569' : '#d1d5db'} />
                            <Text style={styles.emptyText}>
                                {searchQuery
                                    ? 'No users found'
                                    : 'Follow users to share templates'}
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={filteredUsers}
                            renderItem={renderUser}
                            keyExtractor={(item) => item._id}
                            style={styles.userList}
                            showsVerticalScrollIndicator={false}
                        />
                    )}

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleClose}
                            disabled={isSharing}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.shareButton,
                                (isSharing || selectedUsers.length === 0) && styles.shareButtonDisabled,
                            ]}
                            onPress={handleShare}
                            disabled={isSharing || selectedUsers.length === 0}
                        >
                            {isSharing ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.shareButtonText}>Share</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%',
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#334155' : '#e5e7eb',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: isDark ? '#f1f5f9' : '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: isDark ? '#94a3b8' : '#6b7280',
    },
    closeButton: {
        padding: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDark ? '#0f172a' : '#f9fafb',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginHorizontal: 20,
        marginTop: 16,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: isDark ? '#f1f5f9' : '#111827',
    },
    selectedContainer: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    selectedText: {
        fontSize: 14,
        fontWeight: '600',
        color: isDark ? '#a78bfa' : '#9333ea',
    },
    userList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#334155' : '#f3f4f6',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userPhoto: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 12,
    },
    userPhotoPlaceholder: {
        backgroundColor: isDark ? '#334155' : '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 15,
        fontWeight: '600',
        color: isDark ? '#f1f5f9' : '#111827',
        marginBottom: 2,
    },
    userUsername: {
        fontSize: 13,
        color: isDark ? '#94a3b8' : '#6b7280',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: isDark ? '#475569' : '#d1d5db',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: '#9333ea',
        borderColor: '#9333ea',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: isDark ? '#94a3b8' : '#6b7280',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 15,
        color: isDark ? '#94a3b8' : '#6b7280',
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: isDark ? '#334155' : '#e5e7eb',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isDark ? '#475569' : '#d1d5db',
        backgroundColor: isDark ? '#334155' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: isDark ? '#cbd5e1' : '#374151',
    },
    shareButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#9333ea',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareButtonDisabled: {
        opacity: 0.5,
    },
    shareButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
});
