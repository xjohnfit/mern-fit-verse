import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuggestedUser {
    _id: string;
    username: string;
    name: string;
    profilePicture?: string;
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
    if (isLoading) {
        return (
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4">
                <View className="flex-row items-center mb-4">
                    <Ionicons name="people-outline" size={20} color="#3B82F6" />
                    <Text className="text-lg font-bold text-gray-900 dark:text-white ml-2">
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
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-4">
            <View className="flex-row items-center mb-4">
                <Ionicons name="people-outline" size={20} color="#3B82F6" />
                <Text className="text-lg font-bold text-gray-900 dark:text-white ml-2">
                    Suggested Users
                </Text>
            </View>
            <View className="space-y-3">
                {suggestedUsers.map((user) => (
                    <View
                        key={user._id}
                        className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-3"
                    >
                        <TouchableOpacity
                            onPress={() => onUserPress(user.username)}
                            className="flex-row items-center flex-1"
                        >
                            {user.profilePicture ? (
                                <Image
                                    source={{ uri: user.profilePicture }}
                                    className="w-12 h-12 rounded-full mr-3"
                                />
                            ) : (
                                <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center mr-3">
                                    <Text className="text-white font-bold text-lg">
                                        {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            <View className="flex-1">
                                <Text className="text-base font-semibold text-gray-900 dark:text-white">
                                    {user.name}
                                </Text>
                                <Text className="text-sm text-gray-500 dark:text-gray-400">
                                    @{user.username}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onFollow(user.username)}
                            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
                        >
                            <Ionicons name="person-add" size={16} color="white" />
                            <Text className="text-white font-semibold ml-1 text-sm">Follow</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
}
