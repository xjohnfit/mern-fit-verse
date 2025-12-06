import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const isDevelopment = Constants.expoConfig?.extra?.mode === 'development';

// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, localhost works fine
// For physical devices or Expo Go, use your computer's IP address
const getBaseUrl = () => {
    // Use production URL if explicitly set or if not in __DEV__ mode
    const isProduction =
        !__DEV__ || Constants.expoConfig?.extra?.mode === 'production';

    if (isProduction) {
        return 'https://api.fitverse.codewithxjohn.com/api';
    }

    // Development mode
    // IMPORTANT: If using Expo Go or physical device, replace with your computer's IP
    // Find your IP: Windows (ipconfig), Mac/Linux (ifconfig)
    // Example: 'http://192.168.1.100:5004/api'

    // TEMPORARY: Using localhost for web/simulator
    // CHANGE THIS to your IP if using Expo Go or physical device
    const devUrl = 'http://192.168.4.53:5004/api';

    if (Platform.OS === 'android') {
        // For Android emulator, use 10.0.2.2
        // For Expo Go on Android, use your computer's IP
        return 'http://10.0.2.2:5004/api';
    }

    // For iOS simulator, Expo Go on iOS, or web
    return devUrl;
};

const baseUrl = getBaseUrl();
console.log('API Base URL:', baseUrl);

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, _api) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: [
        'User',
        'Posts',
        'Workout',
        'Exercise',
        'Nutrition',
        'CustomCategory',
        'WorkoutTemplate',
        'WorkoutTemplateFolder',
        'Notification',
        'Message',
        'Food',
        'FoodSuggestions',
    ],
    endpoints: (_builder) => ({}),
});

export default apiSlice;
