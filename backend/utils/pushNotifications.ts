import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

export async function sendPushNotification(
    pushToken: string,
    title: string,
    body: string,
    data?: any
) {
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return;
    }

    const message: ExpoPushMessage = {
        to: pushToken,
        sound: 'default',
        title,
        body,
        data,
        priority: 'high',
        channelId: 'default',
    };

    try {
        const ticket = await expo.sendPushNotificationsAsync([message]);
        console.log('Push notification sent:', ticket);
        return ticket;
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
}