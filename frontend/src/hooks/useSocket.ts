import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import {
    setOnlineUsers,
    setConnected,
    setDisconnected,
} from '@/slices/socketSlice';

let socket: Socket | null = null;

const SOCKET_URL =
    import.meta.env.VITE_MODE === 'development'
        ? 'http://localhost:5004'
        : 'https://api.fitverse.codewithxjohn.com'; 

export const useSocket = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state: any) => state.auth);
    const { onlineUsers, isConnected } = useSelector(
        (state: any) => state.socket
    );

    useEffect(() => {
        if (userInfo && !socket) {
            // Initialize socket connection
            socket = io(SOCKET_URL,
                { withCredentials: true }
            );

            socket.on('connect', () => {
                console.log('Socket connected:', socket?.id);
                dispatch(setConnected());

                // Notify server that user is online
                if (userInfo._id) {
                    socket?.emit('user-online', userInfo._id);
                }
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
                dispatch(setDisconnected());
            });

            socket.on('online-users', (users: string[]) => {
                console.log('Online users updated:', users);
                dispatch(setOnlineUsers(users));
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
