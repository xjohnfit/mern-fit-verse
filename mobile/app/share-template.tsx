import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    FlatList,
    ActivityIndicator,
    useColorScheme,
    Image,
    SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useGetUsersWithMessagesQuery } from '@/slices/messageApiSlice';
import { useShareTemplateMutation } from '@/slices/messageApiSlice';
import { useGetFollowingQuery } from '@/slices/usersApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface User {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

export default function ShareTemplateScreen() {
    const params = useLocalSearchParams();
    const templateId = params.templateId as string;
    const templateName = params.templateName as string;

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { data: followingUsers, isLoading: loadingFollowing, error: followingError } = useGetFollowingQuery();
    const { data: conversationUsers, isLoading: loadingConversations, error: conversationError } = useGetUsersWithMessagesQuery(userInfo?._id || '');
    const [shareTemplate, { isLoading: isSharing }] = useShareTemplateMutation();

    const isLoading = loadingConversations; // Only wait for conversations since following is failing

    // For now, just use conversation users until backend is properly restarted
    const sortedUsers = useMemo(() => {
        const conversationList = (Array.isArray(conversationUsers) ? conversationUsers : []) as User[];
        return conversationList;
    }, [conversationUsers]);

    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) {
            return sortedUsers;
        }
        return sortedUsers.filter(
            (user: User) =>
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.username?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [sortedUsers, searchQuery]);

    const toggleUser = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleShare = async () => {
        if (!templateId || !userInfo || selectedUsers.length === 0) {
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
                    templateId: templateId,
                }).unwrap();
            }

            Toast.show({
                type: 'success',
                text1: 'Template Shared',
                text2: `Successfully shared with ${selectedUsers.length} ${selectedUsers.length === 1 ? 'user' : 'users'}`,
            });

            router.back();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Share Failed',
                text2: error?.data?.message || 'Failed to share template',
            });
        }
    };

    const renderUser = ({ item }: { item: User; }) => {
        const isSelected = selectedUsers.includes(item._id);

        return (
            <TouchableOpacity
                style={styles.userItem}
                onPress={() => toggleUser(item._id)}
                activeOpacity={0.7}
            >
                <View style={styles.photoContainer}>
                    {item.photo ? (
                        <Image source={{ uri: item.photo }} style={styles.userPhoto} />
                    ) : (
                        <View style={[styles.userPhoto, styles.userPhotoPlaceholder]}>
                            <Ionicons name="person" size={32} color={isDark ? '#64748b' : '#9ca3af'} />
                        </View>
                    )}
                    {isSelected && (
                        <View style={styles.selectedOverlay}>
                            <View style={styles.checkmarkCircle}>
                                <Ionicons name="checkmark" size={20} color="#fff" />
                            </View>
                        </View>
                    )}
                </View>
                <Text style={styles.userName} numberOfLines={1}>
                    {item.name.split(' ')[0]}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="arrow-back" size={24} color={isDark ? '#f1f5f9' : '#111827'} />
                    </TouchableOpacity>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.title}>Share Template</Text>
                        {templateName && (
                            <Text style={styles.subtitle}>{templateName}</Text>
                        )}
                    </View>
                    <View style={{ width: 24 }} />
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
                        numColumns={4}
                        style={styles.userList}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.userListContent}
                        columnWrapperStyle={styles.columnWrapper}
                    />
                )}

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.back()}
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
        </SafeAreaView>
    );
}

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: isDark ? '#0f172a' : '#f9fafb',
        },
        container: {
            flex: 1,
            backgroundColor: isDark ? '#0f172a' : '#f9fafb',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: isDark ? '#1e293b' : '#fff',
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#334155' : '#e5e7eb',
        },
        backButton: {
            padding: 4,
        },
        headerTextContainer: {
            flex: 1,
            alignItems: 'center',
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#f1f5f9' : '#111827',
        },
        subtitle: {
            fontSize: 13,
            color: isDark ? '#94a3b8' : '#6b7280',
            marginTop: 2,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#1e293b' : '#fff',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 16,
            gap: 10,
            borderWidth: 1,
            borderColor: isDark ? '#334155' : '#e5e7eb',
        },
        searchInput: {
            flex: 1,
            fontSize: 15,
            color: isDark ? '#f1f5f9' : '#111827',
        },
        selectedContainer: {
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        selectedText: {
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#a78bfa' : '#9333ea',
        },
        userList: {
            flex: 1,
        },
        userListContent: {
            paddingHorizontal: 16,
            paddingTop: 8,
        },
        columnWrapper: {
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        userItem: {
            alignItems: 'center',
            width: '23%',
        },
        photoContainer: {
            position: 'relative',
            marginBottom: 8,
        },
        userPhoto: {
            width: 80,
            height: 80,
            borderRadius: 40,
        },
        userPhotoPlaceholder: {
            backgroundColor: isDark ? '#334155' : '#e5e7eb',
            alignItems: 'center',
            justifyContent: 'center',
        },
        selectedOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(147, 51, 234, 0.3)',
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        checkmarkCircle: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#9333ea',
            alignItems: 'center',
            justifyContent: 'center',
        },
        userName: {
            fontSize: 13,
            fontWeight: '600',
            color: isDark ? '#f1f5f9' : '#111827',
            textAlign: 'center',
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
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: isDark ? '#1e293b' : '#fff',
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
