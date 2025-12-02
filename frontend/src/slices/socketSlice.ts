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
        setOnlineUsers(state, action: PayloadAction<string[]>) {
            state.onlineUsers = action.payload;
        },
        setConnected(state) {
            state.isConnected = true;
        },
        setDisconnected(state) {
            state.isConnected = false;
            state.onlineUsers = [];
        },
    },
});

export const { setOnlineUsers, setConnected, setDisconnected } =
    socketSlice.actions;

export default socketSlice.reducer;
