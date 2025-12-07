import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetNotificationsQuery, useDeleteNotificationsMutation } from '../../slices/notificationApiSlice';

interface NotificationBellProps {
    color?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ color = '#fff' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: notifications = [], isLoading } = useGetNotificationsQuery();
    const [deleteNotifications] = useDeleteNotificationsMutation();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleDeleteAll = async () => {
        Alert.alert(
            'Delete All Notifications',
            'Are you sure you want to delete all notifications?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteNotifications().unwrap();
                            setIsOpen(false);
                        } catch (error: any) {
                            Alert.alert('Error', error?.data?.message || 'Failed to delete notifications');
                        }
                    },
                },
            ]
        );
    };

    const getNotificationMessage = (notification: any) => {
        const { type, from } = notification;
        const username = from?.username || 'Someone';

        switch (type) {
            case 'like':
                return `${username} liked your post`;
            case 'unlike':
                return `${username} unliked your post`;
            case 'comment':
                return `${username} commented on your post`;
            case 'follow':
                return `${username} started following you`;
            case 'message':
                return `${username} sent you a message`;
            default:
                return `${username} sent you a notification`;
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'like':
                return 'heart';
            case 'comment':
                return 'chatbubble';
            case 'follow':
                return 'person-add';
            case 'message':
                return 'mail';
            default:
                return 'notifications';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            {/* Bell Button */}
            <TouchableOpacity
                onPress={() => setIsOpen(true)}
                className="relative p-2 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
                <Ionicons name="notifications-outline" size={24} color={color} />
                {unreadCount > 0 && (
                    <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center px-1">
                        <Text className="text-white text-xs font-bold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Notification Modal */}
            <Modal
                visible={isOpen}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setIsOpen(false)}
            >
                <View className="flex-1 bg-gray-50 dark:bg-gray-900">
                    {/* Header */}
                    <View className="bg-blue-500 dark:bg-blue-600 pt-12 pb-4 px-4">
                        <View className="flex-row items-center justify-between mt-10">
                            <View className="flex-row items-center">
                                <Ionicons name="notifications" size={24} color="#fff" />
                                <Text className="text-white text-xl font-bold ml-2">
                                    Notifications
                                </Text>
                                {unreadCount > 0 && (
                                    <View className="bg-red-500 rounded-full ml-2 px-2 py-1">
                                        <Text className="text-white text-xs font-bold">
                                            {unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View className="flex-row items-center">
                                {notifications.length > 0 && (
                                    <TouchableOpacity
                                        onPress={handleDeleteAll}
                                        className="mr-3 p-2"
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#fff" />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() => setIsOpen(false)}
                                    className="p-2"
                                >
                                    <Ionicons name="close" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Notifications List */}
                    <ScrollView className="flex-1">
                        {isLoading ? (
                            <View className="flex-1 items-center justify-center py-12">
                                <ActivityIndicator size="large" color="#3b82f6" />
                                <Text className="text-gray-600 dark:text-gray-400 mt-4">
                                    Loading notifications...
                                </Text>
                            </View>
                        ) : notifications.length === 0 ? (
                            <View className="flex-1 items-center justify-center py-12">
                                <Ionicons name="notifications-off-outline" size={64} color="#9ca3af" />
                                <Text className="text-gray-600 dark:text-gray-400 font-medium mt-4">
                                    No notifications yet
                                </Text>
                                <Text className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                                    We'll notify you when something happens
                                </Text>
                            </View>
                        ) : (
                            <View>
                                {notifications.map((notification) => (
                                    <TouchableOpacity
                                        key={notification._id}
                                        className={`px-4 py-4 border-b border-gray-200 dark:border-gray-800 ${!notification.isRead
                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                            : 'bg-white dark:bg-gray-800'
                                            }`}
                                    >
                                        <View className="flex-row items-start">
                                            {/* User Avatar */}
                                            {notification.from?.photo ? (
                                                <View className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                                                    <Image
                                                        source={{ uri: notification.from.photo }}
                                                        className="w-full h-full"
                                                        resizeMode="cover"
                                                    />
                                                </View>
                                            ) : (
                                                <View className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                                                    <Ionicons
                                                        name="person"
                                                        size={24}
                                                        color="#9ca3af"
                                                    />
                                                </View>
                                            )}

                                            {/* Content */}
                                            <View className="flex-1 ml-3">
                                                <View className="flex-row items-center justify-between">
                                                    <View className="flex-row items-center flex-1">
                                                        <Ionicons
                                                            name={getNotificationIcon(notification.type)}
                                                            size={16}
                                                            color={
                                                                notification.type === 'like'
                                                                    ? '#ef4444'
                                                                    : notification.type === 'follow'
                                                                        ? '#3b82f6'
                                                                        : '#6b7280'
                                                            }
                                                        />
                                                        <Text className="text-gray-900 dark:text-gray-100 font-medium text-sm ml-2 flex-1">
                                                            {getNotificationMessage(notification)}
                                                        </Text>
                                                    </View>
                                                    {!notification.isRead && (
                                                        <View className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
                                                    )}
                                                </View>
                                                <Text className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                                    {formatTimestamp(notification.createdAt)}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </Modal>
        </>
    );
};
