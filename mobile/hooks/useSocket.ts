import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import {
    setOnlineUsers,
    setConnected,
    setDisconnected,
} from '@/slices/socketSlice';

let socket: Socket | null = null;

const getSocketUrl = () => {
    // Use mode from app.json as the source of truth
    const mode = Constants.expoConfig?.extra?.mode;
    const isProduction = mode === 'production';

    if (isProduction) {
        return 'https://api.fitverse.codewithxjohn.com';
    }

    // Development mode
    const YOUR_IP = '192.168.4.53';
    const devUrl = `http://${YOUR_IP}:5004`;

    // Check if running in Expo Go (physical device)
    const isExpoGo = Constants.appOwnership === 'expo';

    if (Platform.OS === 'android') {
        return isExpoGo ? devUrl : 'http://10.0.2.2:5004';
    }

    if (Platform.OS === 'ios') {
        return isExpoGo ? devUrl : 'http://localhost:5004';
    }

    return 'http://localhost:5004';
};

const SOCKET_URL = getSocketUrl();

export const useSocket = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: any) => state.auth);
    const { onlineUsers, isConnected } = useSelector(
        (state: any) => state.socket,
    );

    useEffect(() => {
        if (userInfo && !socket) {
            // Initialize socket connection
            socket = io(SOCKET_URL, {
                withCredentials: true,
                transports: ['websocket', 'polling'],
            });

            socket.on('connect', () => {
                dispatch(setConnected());

                // Notify server that user is online
                if (userInfo._id) {
                    socket?.emit('user-online', userInfo._id);
                }
            });

            socket.on('disconnect', () => {
                dispatch(setDisconnected());
            });

            socket.on('online-users', (users: string[]) => {
                dispatch(setOnlineUsers(users));
            });

            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
            });

            return () => {
                if (socket) {
                    socket.disconnect();
                    socket = null;
                }
            };
        }

        // Cleanup on logout
        if (!userInfo && socket) {
            socket.disconnect();
            socket = null;
            dispatch(setDisconnected());
        }
    }, [userInfo, dispatch]);

    return { socket, onlineUsers, isConnected };
};

export const getSocket = (): Socket | null => {
    return socket;
};
