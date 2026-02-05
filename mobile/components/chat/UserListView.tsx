import React, { useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    ActivityIndicator,
    useColorScheme,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserListItem from './UserListItem';
import EmptyState from './EmptyState';
import createStyles from '@/styles/chat/UserListViewStyles';

interface User {
    _id: string;
    name: string;
    username: string;
    photo?: string;
    lastMessageAt?: string;
}

interface UserListViewProps {
    users: User[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onlineUsers: string[];
    onUserSelect: (user: User) => void;
    isLoading: boolean;
}

const UserListView: React.FC<UserListViewProps> = ({
    users,
    searchQuery,
    setSearchQuery,
    onlineUsers,
    onUserSelect,
    isLoading,
}) => {
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const styles = useMemo(() => createStyles(colorScheme === 'dark'), [colorScheme]);

    // Sort users by latest message timestamp (most recent first)
    // Backend already sorts by lastMessageAt, but we can add secondary sorting
    const sortedUsers = [...users].sort((a: User, b: User) => {
        // If both have lastMessageAt, sort by timestamp
        if (a.lastMessageAt && b.lastMessageAt) {
            return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
        }
        // If only one has lastMessageAt, prioritize it
        if (a.lastMessageAt && !b.lastMessageAt) return -1;
        if (!a.lastMessageAt && b.lastMessageAt) return 1;
        
        // If neither has lastMessageAt, sort by online status
        const aOnline = onlineUsers.includes(a._id);
        const bOnline = onlineUsers.includes(b._id);
        if (aOnline && !bOnline) return -1;
        if (!aOnline && bOnline) return 1;
        
        return 0;
    });

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#06b6d4" />
            <View style={styles.container}>
                {/* Header with Gradient */}
                <LinearGradient
                    colors={['#06b6d4', '#0891b2', '#0e7490']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.header, { paddingTop: insets.top + 20 }]}
                >
                    <View style={styles.headerTop}>
                        <View style={styles.headerIconContainer}>
                            <Ionicons name="chatbubbles" size={32} color="#FFFFFF" />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Messages</Text>
                            <Text style={styles.headerSubtitle}>
                                Chat with your connections
                            </Text>
                        </View>
                    </View>

                    {/* Search */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color="#FFFFFF" />
                        <TextInput
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={styles.searchInput}
                            placeholderTextColor="rgba(255,255,255,0.8)"
                        />
                    </View>
                </LinearGradient>

                {/* Users List */}
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#06b6d4" />
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                ) : sortedUsers && sortedUsers.length > 0 ? (
                    <FlatList
                        data={sortedUsers}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <UserListItem
                                user={item}
                                isOnline={onlineUsers.includes(item._id)}
                                onPress={() => onUserSelect(item)}
                            />
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                ) : (
                    <EmptyState
                        icon="chatbubbles-outline"
                        title={searchQuery ? 'No users found' : 'No conversations yet'}
                        subtitle={
                            searchQuery
                                ? 'Try searching for a different user'
                                : 'Start following people to message them'
                        }
                    />
                )}
            </View>
        </>
    );
};

export default UserListView;

