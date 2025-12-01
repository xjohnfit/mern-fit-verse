import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
    onlineUsers: string[]; // array of user IDs
    isConnected: boolean;
}

const initialState: SocketState = {
    onlineUsers: [],
    isConnected: false,
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setOnlineUsers: (state, action: PayloadAction<string[]>) => {
            state.onlineUsers = action.payload;
        },
        addOnlineUser: (state, action: PayloadAction<string>) => {
            if (!state.onlineUsers.includes(action.payload)) {
                state.onlineUsers.push(action.payload);
            }
        },
        removeOnlineUser: (state, action: PayloadAction<string>) => {
            state.onlineUsers = state.onlineUsers.filter(
                (id) => id !== action.payload
            );
        },
        setConnectionStatus: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },
        clearSocketState: (state) => {
            state.onlineUsers = [];
            state.isConnected = false;
        },
    },
});

export const {
    setOnlineUsers,
    addOnlineUser,
    removeOnlineUser,
    setConnectionStatus,
    clearSocketState,
} = socketSlice.actions;

export default socketSlice.reducer;
