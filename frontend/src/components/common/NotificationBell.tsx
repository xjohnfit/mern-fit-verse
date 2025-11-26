import { Bell, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import {
    useGetNotificationsQuery,
    useDeleteNotificationsMutation,
} from '@/slices/notificationApiSlice';
import { toast } from 'sonner';
import { getInitials } from '@/lib/getInitials';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: notifications = [], isLoading } = useGetNotificationsQuery();
    const [deleteNotifications] = useDeleteNotificationsMutation();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleDeleteAll = async () => {
        try {
            await deleteNotifications().unwrap();
            toast.success('All notifications deleted');
            setIsOpen(false);
        } catch (error: any) {
            toast.error(
                error?.data?.message || 'Failed to delete notifications'
            );
        }
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
        const iconClass = 'w-4 h-4';
        switch (type) {
            case 'like':
                return <span className={iconClass}>❤️</span>;
            case 'comment':
                return <span className={iconClass}>💬</span>;
            case 'follow':
                return <span className={iconClass}>👤</span>;
            case 'message':
                return <span className={iconClass}>✉️</span>;
            default:
                return <span className={iconClass}>🔔</span>;
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000
        );

        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800)
            return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className='relative'>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='relative p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200'>
                <Bell className='w-5 h-5' />
                {unreadCount > 0 && (
                    <span className='absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse'>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className='fixed inset-0 z-40'
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Panel */}
                    <div className='fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto mt-2 sm:w-96 max-h-[70vh] sm:max-h-128 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 overflow-hidden'>
                        {/* Header */}
                        <div className='flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50'>
                            <div className='flex items-center space-x-2'>
                                <Bell className='w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400' />
                                <h3 className='text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100'>
                                    Notifications
                                </h3>
                                {unreadCount > 0 && (
                                    <span className='px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full'>
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div className='flex items-center space-x-1'>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={handleDeleteAll}
                                        className='p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200'
                                        title='Delete all notifications'>
                                        <Trash2 className='w-4 h-4' />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className='p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200'>
                                    <X className='w-4 h-4' />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className='overflow-y-auto max-h-[calc(70vh-4rem)] sm:max-h-112'>
                            {isLoading ? (
                                <div className='p-8 text-center'>
                                    <div className='inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
                                    <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                                        Loading notifications...
                                    </p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className='p-6 sm:p-8 text-center'>
                                    <Bell className='w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3' />
                                    <p className='text-gray-600 dark:text-gray-400 font-medium'>
                                        No notifications yet
                                    </p>
                                    <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
                                        We'll notify you when something happens
                                    </p>
                                </div>
                            ) : (
                                <div className='divide-y divide-gray-200 dark:divide-gray-800'>
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            className={`p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${!notification.isRead
                                                ? 'bg-blue-50/50 dark:bg-blue-900/10'
                                                : ''
                                                }`}>
                                            <div className='flex items-start space-x-2 sm:space-x-3'>
                                                {/* User Avatar */}
                                                {notification.from?.photo ? (
                                                    <img
                                                        src={
                                                            notification.from
                                                                .photo
                                                        }
                                                        alt={
                                                            notification.from
                                                                .username
                                                        }
                                                        className='w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700'
                                                    />
                                                ) : (
                                                    <Avatar className='w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-gray-200 dark:ring-gray-700'>
                                                        <AvatarFallback className='bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm'>
                                                            {getInitials(
                                                                notification.from
                                                                    ?.username ||
                                                                'User'
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}

                                                {/* Content */}
                                                <div className='flex-1 min-w-0'>
                                                    <div className='flex items-start justify-between'>
                                                        <div className='flex items-center space-x-2'>
                                                            {getNotificationIcon(
                                                                notification.type
                                                            )}
                                                            <p className='text-sm text-gray-900 dark:text-gray-100 font-medium'>
                                                                {getNotificationMessage(
                                                                    notification
                                                                )}
                                                            </p>
                                                        </div>
                                                        {!notification.isRead && (
                                                            <span className='shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1.5' />
                                                        )}
                                                    </div>
                                                    <p className='text-xs text-gray-500 dark:text-gray-500 mt-1'>
                                                        {formatTimestamp(
                                                            notification.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
