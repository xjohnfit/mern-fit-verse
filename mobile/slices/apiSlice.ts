import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBaseUrl = () => {
    // Use mode from app.json as the source of truth
    const mode = Constants.expoConfig?.extra?.mode;
    const isProduction = mode === 'production';

    if (isProduction) {
        return 'https://api.fitverse.codewithxjohn.com/api';
    }

    // Development mode
    // Your computer's IP address (update this if your IP changes)
    const YOUR_IP = '192.168.4.53';
    const devUrl = `http://${YOUR_IP}:5004/api`;

    // Check if running in Expo Go (physical device)
    const isExpoGo = Constants.appOwnership === 'expo';

    if (Platform.OS === 'android') {
        return isExpoGo ? devUrl : 'http://10.0.2.2:5004/api';
    }

    if (Platform.OS === 'ios') {
        // For iOS simulator, localhost works
        // For Expo Go on iOS physical device, use computer's IP
        return isExpoGo ? devUrl : 'http://localhost:5004/api';
    }

    // For web or other platforms
    return 'http://localhost:5004/api';
};

const baseUrl = getBaseUrl();

// Export baseUrl for other slices that need direct fetch
export { baseUrl };

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
        'Report',
        'Block',
    ],
    endpoints: (_builder) => ({}),
});

export default apiSlice;
