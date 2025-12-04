import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserInfo {
    _id: string;
    name: string;
    username: string;
    email: string;
    photo?: string;
    dob?: string;
    gender?: string;
    admin?: boolean;
    [key: string]: any;
}

interface AuthState {
    userInfo: UserInfo | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    userInfo: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<UserInfo>) => {
            state.isAuthenticated = true;
            state.userInfo = action.payload;
            AsyncStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        clearCredentials: (state) => {
            state.isAuthenticated = false;
            state.userInfo = null;
            AsyncStorage.removeItem('userInfo');
        },
        restoreCredentials: (state, action: PayloadAction<UserInfo>) => {
            state.isAuthenticated = true;
            state.userInfo = action.payload;
        },
    },
});

export default authSlice.reducer;
export const { setCredentials, clearCredentials, restoreCredentials } =
    authSlice.actions;
