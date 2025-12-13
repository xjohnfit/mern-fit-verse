import { View, Text, TouchableOpacity, ActivityIndicator, Image, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import suggestedUsersStyles from '../../styles/dashboard/SuggestedUsersStyles';

interface SuggestedUser {
    _id: string;
    username: string;
    name: string;
    photo?: string;
    followers?: string[];
}

interface SuggestedUsersProps {
    users: SuggestedUser[];
    isLoading: boolean;
    onFollow: (username: string) => void;
    onUserPress: (username: string) => void;
}

export default function SuggestedUsers({
    users,
    isLoading,
    onFollow,
    onUserPress,
}: SuggestedUsersProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    if (isLoading) {
        return (
            <View style={[suggestedUsersStyles.loadingContainer, isDark && suggestedUsersStyles.loadingContainerDark]}>
                <View style={suggestedUsersStyles.header}>
                    <Ionicons name="people-outline" size={20} color="#3B82F6" />
                    <Text style={[suggestedUsersStyles.headerTitle, isDark && suggestedUsersStyles.headerTitleDark]}>
                        Suggested Users
                    </Text>
                </View>
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    const suggestedUsers = users?.slice(0, 3) || [];

    if (suggestedUsers.length === 0) {
        return null;
    }

    return (
        <View style={[suggestedUsersStyles.container, isDark && suggestedUsersStyles.containerDark]}>
            <View style={suggestedUsersStyles.header}>
                <Ionicons name="people-outline" size={20} color="#3B82F6" />
                <Text style={[suggestedUsersStyles.headerTitle, isDark && suggestedUsersStyles.headerTitleDark]}>
                    Suggested Users
                </Text>
            </View>
            <View style={suggestedUsersStyles.cardsContainer}>
                {suggestedUsers.map((user) => (
                    <View
                        key={user._id}
                        style={[suggestedUsersStyles.userCard, isDark && suggestedUsersStyles.userCardDark]}
                    >
                        <TouchableOpacity
                            onPress={() => onUserPress(user.username)}
                            style={suggestedUsersStyles.userInfoContainer}
                            activeOpacity={0.7}
                        >
                            {user.photo ? (
                                <Image
                                    source={{ uri: user.photo }}
                                    style={suggestedUsersStyles.avatar}
                                />
                            ) : (
                                <View style={suggestedUsersStyles.avatarPlaceholder}>
                                    <Text style={suggestedUsersStyles.avatarText}>
                                        {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            <View style={suggestedUsersStyles.userDetails}>
                                <Text style={[suggestedUsersStyles.userName, isDark && suggestedUsersStyles.userNameDark]}>
                                    {user.name}
                                </Text>
                                <Text style={[suggestedUsersStyles.userUsername, isDark && suggestedUsersStyles.userUsernameDark]}>
                                    @{user.username}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onFollow(user.username)}
                            style={suggestedUsersStyles.followButton}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="person-add" size={16} color="white" />
                            <Text style={suggestedUsersStyles.followButtonText}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
}
