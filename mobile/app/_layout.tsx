// Styles
import '../global.css';

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
import { restoreCredentials } from '../slices/authSlice';
import { useSocket } from '../hooks/useSocket';
import { registerForPushNotificationsAsync } from '../lib/notifications';
import * as Notifications from 'expo-notifications';

// Configure notification handler at app level for background notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function RootLayoutContent() {
  // Initialize socket connection
  useSocket();

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
        console.log('Notification token registered:', token);
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
