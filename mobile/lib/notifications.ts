import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Note: Notification handler is now set in app/_layout.tsx for global coverage

/**
 * Request notification permissions from the user
 */
export async function registerForPushNotificationsAsync(): Promise<
    string | undefined
> {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            lockscreenVisibility:
                Notifications.AndroidNotificationVisibility.PUBLIC,
            bypassDnd: true,
        });
    }

    if (Constants.isDevice || Platform.OS === 'ios') {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                    allowDisplayInCarPlay: true,
                    allowCriticalAlerts: true,
                },
            });
            finalStatus = status;
        }
        
        try {
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            if (!projectId) {
                console.error('No project ID found');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync({ projectId }))
                .data;
        } catch (error) {
            console.error('Error getting push token:', error);
        }
    }

    return token;
}

/**
 * Show a local notification for a new message
 */
export async function showMessageNotification(
    senderName: string,
    message: string,
    senderId: string
) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: senderName,
            body: message,
            data: { senderId, type: 'message' },
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            categoryIdentifier: 'message',
        },
        trigger: null, // Show immediately
    });
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications() {
    await Notifications.dismissAllNotificationsAsync();
}

/**
 * Get notification badge count
 */
export async function getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
}

/**
 * Set the notification badge count
 */
export async function setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count);
}

/**
 * Add notification listener
 */
export function addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
) {
    return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add notification response listener (when user taps notification)
 */
export function addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
) {
    return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Save push token to backend
 */
export async function savePushTokenToBackend(token: string, userId: string) {
    try {
        // You'll need to implement this endpoint on your backend
        // TODO: Uncomment when backend endpoint is ready
        // const response = await fetch(`${API_URL}/users/push-token`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ pushToken: token, userId }),
        // });
        // return await response.json();
    } catch (error) {
        console.error('Error saving push token:', error);
    }
}
