import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import createStyles from '@/styles/chat/UserListItemStyles';

interface User {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

interface UserListItemProps {
    user: User;
    isOnline: boolean;
    onPress: () => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, isOnline, onPress }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.avatarContainer}>
                {user.photo ? (
                    <Image source={{ uri: user.photo }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
                    </View>
                )}
                <View
                    style={[
                        isOnline ? styles.onlineIndicator : styles.offlineIndicator,
                        { borderColor: isDark ? '#1F2937' : '#FFFFFF' },
                    ]}
                />
            </View>
            <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: isDark ? '#f9fafb' : '#1f2937' }]}>
                    {user.name}
                </Text>
                <Text
                    style={[
                        styles.userStatus,
                        { color: isOnline ? '#3B82F6' : '#6b7280' },
                    ]}
                >
                    {isOnline ? 'Online' : 'Offline'}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#06b6d4" />
        </TouchableOpacity>
    );
};

export default UserListItem;

