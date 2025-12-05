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

function RootLayoutContent() {
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
