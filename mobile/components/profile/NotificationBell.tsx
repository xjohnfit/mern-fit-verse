import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Alert, Image, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetNotificationsQuery, useDeleteNotificationsMutation } from '../../slices/notificationApiSlice';
import NotificationBellStyles from '../../styles/profile/NotificationBellStyles';

interface NotificationBellProps {
    color?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ color = '#fff' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: notifications = [], isLoading } = useGetNotificationsQuery();
    const [deleteNotifications] = useDeleteNotificationsMutation();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

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
                style={NotificationBellStyles.bellButton}
            >
                <Ionicons name="notifications-outline" size={24} color={color} />
                {unreadCount > 0 && (
                    <View style={NotificationBellStyles.badge}>
                        <Text style={NotificationBellStyles.badgeText}>
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
                <View style={isDark ? NotificationBellStyles.modalContainerDark : NotificationBellStyles.modalContainer}>
                    {/* Header */}
                    <View style={isDark ? NotificationBellStyles.modalHeaderDark : NotificationBellStyles.modalHeader}>
                        <View style={NotificationBellStyles.headerContent}>
                            <View style={NotificationBellStyles.headerLeft}>
                                <Ionicons name="notifications" size={24} color="#fff" />
                                <Text style={NotificationBellStyles.headerTitle}>
                                    Notifications
                                </Text>
                                {unreadCount > 0 && (
                                    <View style={NotificationBellStyles.headerBadge}>
                                        <Text style={NotificationBellStyles.headerBadgeText}>
                                            {unreadCount}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View style={NotificationBellStyles.headerRight}>
                                {notifications.length > 0 && (
                                    <TouchableOpacity
                                        onPress={handleDeleteAll}
                                        style={NotificationBellStyles.deleteButton}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#fff" />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={() => setIsOpen(false)}
                                    style={NotificationBellStyles.closeButton}
                                >
                                    <Ionicons name="close" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Notifications List */}
                    <ScrollView style={{ flex: 1 }}>
                        {isLoading ? (
                            <View style={NotificationBellStyles.loadingContainer}>
                                <ActivityIndicator size="large" color="#3b82f6" />
                                <Text style={isDark ? NotificationBellStyles.loadingTextDark : NotificationBellStyles.loadingText}>
                                    Loading notifications...
                                </Text>
                            </View>
                        ) : notifications.length === 0 ? (
                            <View style={NotificationBellStyles.emptyContainer}>
                                <Ionicons name="notifications-off-outline" size={64} color="#9ca3af" />
                                <Text style={isDark ? NotificationBellStyles.emptyTitleDark : NotificationBellStyles.emptyTitle}>
                                    No notifications yet
                                </Text>
                                <Text style={isDark ? NotificationBellStyles.emptySubtitleDark : NotificationBellStyles.emptySubtitle}>
                                    We'll notify you when something happens
                                </Text>
                            </View>
                        ) : (
                            <View>
                                {notifications.map((notification) => (
                                    <TouchableOpacity
                                        key={notification._id}
                                        style={
                                            !notification.isRead
                                                ? isDark ? NotificationBellStyles.notificationItemUnreadDark : NotificationBellStyles.notificationItemUnread
                                                : isDark ? NotificationBellStyles.notificationItemDark : NotificationBellStyles.notificationItem
                                        }
                                    >
                                        <View style={NotificationBellStyles.notificationContent}>
                                            {/* User Avatar */}
                                            {notification.from?.photo ? (
                                                <View style={isDark ? NotificationBellStyles.avatarContainerDark : NotificationBellStyles.avatarContainer}>
                                                    <Image
                                                        source={{ uri: notification.from.photo }}
                                                        style={NotificationBellStyles.avatar}
                                                        resizeMode="cover"
                                                    />
                                                </View>
                                            ) : (
                                                <View style={isDark ? NotificationBellStyles.avatarPlaceholderDark : NotificationBellStyles.avatarPlaceholder}>
                                                    <Ionicons
                                                        name="person"
                                                        size={24}
                                                        color="#9ca3af"
                                                    />
                                                </View>
                                            )}

                                            {/* Content */}
                                            <View style={NotificationBellStyles.notificationTextContainer}>
                                                <View style={NotificationBellStyles.notificationHeader}>
                                                    <View style={NotificationBellStyles.notificationHeaderLeft}>
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
                                                        <Text style={isDark ? NotificationBellStyles.notificationMessageDark : NotificationBellStyles.notificationMessage}>
                                                            {getNotificationMessage(notification)}
                                                        </Text>
                                                    </View>
                                                    {!notification.isRead && (
                                                        <View style={NotificationBellStyles.unreadDot} />
                                                    )}
                                                </View>
                                                <Text style={isDark ? NotificationBellStyles.timestampDark : NotificationBellStyles.timestamp}>
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
