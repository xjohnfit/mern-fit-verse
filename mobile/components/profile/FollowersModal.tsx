import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    Image,
    Pressable,
    useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getInitials } from '../../lib/getInitials';
import FollowersModalStyles from '../../styles/profile/FollowersModalStyles';

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
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

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
                style={isDark ? FollowersModalStyles.userItemDark : FollowersModalStyles.userItem}
            >
                {/* User Photo */}
                <View style={isDark ? FollowersModalStyles.userPhotoContainerDark : FollowersModalStyles.userPhotoContainer}>
                    {item.photo ? (
                        <Image
                            source={{ uri: item.photo }}
                            style={FollowersModalStyles.userPhoto}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={isDark ? FollowersModalStyles.userPhotoPlaceholderDark : FollowersModalStyles.userPhotoPlaceholder}>
                            <Ionicons name="person" size={24} color="#9ca3af" />
                        </View>
                    )}
                </View>

                {/* User Info */}
                <View style={FollowersModalStyles.userInfo}>
                    <Text style={isDark ? FollowersModalStyles.userNameDark : FollowersModalStyles.userName}>
                        {item.name || 'Unknown User'}
                    </Text>
                    <Text style={isDark ? FollowersModalStyles.userUsernameDark : FollowersModalStyles.userUsername}>
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
            <View style={FollowersModalStyles.modalOverlay}>
                <View style={isDark ? FollowersModalStyles.modalContentDark : FollowersModalStyles.modalContent}>
                    {/* Header */}
                    <View style={isDark ? FollowersModalStyles.headerDark : FollowersModalStyles.header}>
                        <Text style={isDark ? FollowersModalStyles.titleDark : FollowersModalStyles.title}>
                            {title}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={FollowersModalStyles.closeButton}>
                            <Ionicons name="close" size={24} color="#6b7280" />
                        </TouchableOpacity>
                    </View>

                    {/* Users List */}
                    {users && users.length > 0 ? (
                        <FlatList
                            data={users.filter(user => user && user._id)}
                            renderItem={renderUserItem}
                            keyExtractor={(item, index) => item._id || `user-${index}`}
                            style={FollowersModalStyles.listContainer}
                        />
                    ) : (
                        <View style={FollowersModalStyles.emptyContainer}>
                            <Text style={isDark ? FollowersModalStyles.emptyTextDark : FollowersModalStyles.emptyText}>
                                No {type} yet
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};
