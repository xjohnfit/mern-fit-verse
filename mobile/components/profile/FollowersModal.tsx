import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    Image,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getInitials } from '../../lib/getInitials';

interface UserItem {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

interface FollowersModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'followers' | 'following';
    users: UserItem[];
    title: string;
    onUserPress?: (username: string) => void;
}

export const FollowersModal: React.FC<FollowersModalProps> = ({
    isOpen,
    onClose,
    type,
    users,
    title,
    onUserPress,
}) => {
    // Debug logging removed

    const renderUserItem = ({ item, index }: { item: UserItem; index: number; }) => {
        if (!item || !item._id) return null;

        return (
            <Pressable
                onPress={() => {
                    if (onUserPress && item.username) {
                        onUserPress(item.username);
                    }
                    onClose();
                }}
                className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700"
            >
                {/* User Photo */}
                <View className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3">
                    {item.photo ? (
                        <Image
                            source={{ uri: item.photo }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-full flex items-center justify-center bg-blue-600">
                            <Text className="text-white text-sm font-bold">
                                {getInitials(item.name)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* User Info */}
                <View className="flex-1">
                    <Text className="font-semibold text-gray-900 dark:text-gray-100">
                        {item.name || 'Unknown User'}
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                        @{item.username || 'unknown'}
                    </Text>
                </View>
            </Pressable>
        );
    };

    return (
        <Modal
            visible={isOpen}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50">
                <View className="flex-1 mt-20 bg-white dark:bg-gray-900 rounded-t-3xl">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {title}
                        </Text>
                        <TouchableOpacity onPress={onClose} className="p-2">
                            <Ionicons name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Users List */}
                    {users && users.length > 0 ? (
                        <FlatList
                            data={users.filter(user => user && user._id)}
                            renderItem={renderUserItem}
                            keyExtractor={(item, index) => item._id || `user-${index}`}
                            className="flex-1"
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center p-8">
                            <Text className="text-gray-500 dark:text-gray-400 text-center">
                                No {type} yet
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};
