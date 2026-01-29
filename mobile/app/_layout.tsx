// React
import { useEffect } from 'react';

// Third-party libraries
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Local imports
import store from '../store';
import { restoreCredentials, setCredentials } from '../slices/authSlice';
import { useSocket } from '../hooks/useSocket';
import { registerForPushNotificationsAsync } from '../lib/notifications';
import * as Notifications from 'expo-notifications';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';

import { useUpdatePushTokenMutation } from '../slices/notificationApiSlice';
import { useGetUserProfileQuery } from '../slices/usersApiSlice';

// Configure notification handler at app level for background notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

function RootLayoutContent() {
    // Initialize socket connection
    useSocket();

    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector((state) => state.auth);

    // Fetch fresh user profile from server when user is authenticated
    const { data: freshUserProfile } = useGetUserProfileQuery(undefined, {
        skip: !userInfo?._id, // Only fetch if user is logged in
    });

    // Update Redux with fresh data from server
    useEffect(() => {
        if (freshUserProfile) {
            dispatch(setCredentials(freshUserProfile));
        }
    }, [freshUserProfile, dispatch]);

    useEffect(() => {
        // Restore user credentials from AsyncStorage on app start
        const restoreUser = async () => {
            try {
                const userInfo = await AsyncStorage.getItem('userInfo');
                if (userInfo) {
                    store.dispatch(restoreCredentials(JSON.parse(userInfo)));
                }
            } catch (error) {
                console.error('Failed to restore user credentials:', error);
            }
        };

        restoreUser();
    }, []);

    // Request notification permissions on app startup
    useEffect(() => {
        const requestPermissions = async () => {
            const token = await registerForPushNotificationsAsync();
            if (token) {
                // Save token to AsyncStorage for later use
                try {
                    await AsyncStorage.setItem('pushToken', token);
                } catch (error) {
                    console.error('Failed to save push token:', error);
                }
            }
        };

        requestPermissions();
    }, []);

    const [updatePushToken] = useUpdatePushTokenMutation();

    useEffect(() => {
        const registerToken = async () => {
            const token = await registerForPushNotificationsAsync();
            if (token && userInfo?._id) {
                await updatePushToken(token);
            }
        };
        registerToken();
    }, [userInfo, updatePushToken]);

    return (
        <>
            <Stack screenOptions={{ headerShown: false }} />
            <Toast />
        </>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <RootLayoutContent />
            </Provider>
        </SafeAreaProvider>
    );
}
