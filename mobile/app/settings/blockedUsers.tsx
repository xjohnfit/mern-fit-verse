import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    useColorScheme,
    StatusBar,
    Alert,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGetBlockedUsersQuery, useUnblockUserMutation } from '@/slices/blockApiSlice';
import { blockedUsersStyles } from '@/styles/settings/blockedUsersStyles';

interface BlockedUser {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

const BlockedUsersScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = blockedUsersStyles(isDark);

    const { data, isLoading, refetch } = useGetBlockedUsersQuery();
    const [unblockUser, { isLoading: isUnblocking }] = useUnblockUserMutation();

    const blockedUsers = data?.blockedUsers || [];

    const handleUnblock = (userId: string, username: string) => {
        Alert.alert(
            'Unblock User',
            `Are you sure you want to unblock @${username}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Unblock',
                    style: 'default',
                    onPress: async () => {
                        try {
                            await unblockUser(userId).unwrap();
                            Alert.alert('Success', `You have unblocked @${username}`);
                            refetch();
                        } catch (error: any) {
                            Alert.alert('Error', error.data?.message || 'Failed to unblock user');
                        }
                    },
                },
            ]
        );
    };

    const renderBlockedUser = ({ item }: { item: BlockedUser; }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                {item.photo ? (
                    <Image source={{ uri: item.photo }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {item.name?.charAt(0)?.toUpperCase() || '?'}
                        </Text>
                    </View>
                )}
                <View style={styles.userDetails}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userUsername}>@{item.username}</Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => handleUnblock(item._id, item.username)}
                style={styles.unblockButton}
                disabled={isUnblocking}
            >
                <Text style={styles.unblockButtonText}>Unblock</Text>
            </TouchableOpacity>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={isDark ? '#666' : '#ccc'} />
            <Text style={styles.emptyTitle}>No Blocked Users</Text>
            <Text style={styles.emptyText}>
                You haven't blocked anyone yet. Blocked users won't be able to see your posts or interact
                with you.
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Gradient Header */}
            <LinearGradient
                colors={['#6366f1', '#4f46e5', '#4338ca']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerContainer}
            >
                <View style={[styles.headerInner, { paddingTop: insets.top + 16 }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.headerContent}>
                        <View style={styles.iconContainer}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.15)']}
                                style={styles.iconGradient}
                            >
                                <Ionicons name="ban" size={28} color="#fff" />
                            </LinearGradient>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Blocked Users</Text>
                            <Text style={styles.subtitle}>
                                {blockedUsers.length} {blockedUsers.length === 1 ? 'user' : 'users'} blocked
                            </Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            {/* Content */}
            <View style={styles.contentWrapper}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#6366f1" />
                    </View>
                ) : (
                    <FlatList
                        data={blockedUsers}
                        keyExtractor={(item) => item._id}
                        renderItem={renderBlockedUser}
                        ListEmptyComponent={renderEmpty}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
};

export default BlockedUsersScreen;
