import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import createStyles from '@/styles/chat/ChatHeaderStyles';

interface User {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

interface ChatHeaderProps {
    user: User;
    isOnline: boolean;
    onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ user, isOnline, onBack }) => {
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const styles = useMemo(() => createStyles(colorScheme === 'dark'), [colorScheme]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleUserPress = () => {
        router.push(`/(tabs)/profile?username=${user.username}`);
    };

    return (
        <LinearGradient
            colors={['#06b6d4', '#0891b2', '#0e7490']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                paddingTop: insets.top + 12,
                paddingHorizontal: 16,
                paddingBottom: 16,
                borderTopLeftRadius: 47,
                borderTopRightRadius: 47,
            }}
        >
            <View style={styles.container}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.avatarContainer}
                    onPress={handleUserPress}
                    activeOpacity={0.7}
                >
                    {user.photo ? (
                        <Image source={{ uri: user.photo }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
                        </View>
                    )}
                    <View style={isOnline ? styles.onlineIndicator : styles.offlineIndicator} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.userInfo}
                    onPress={handleUserPress}
                    activeOpacity={0.7}
                >
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userStatus}>
                        {isOnline ? 'Online' : `@${user.username}`}
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default ChatHeader;