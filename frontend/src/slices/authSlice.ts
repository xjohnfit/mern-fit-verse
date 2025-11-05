import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null,
    isAuthenticated: localStorage.getItem('userInfo') ? true : false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.isAuthenticated = true;
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        clearCredentials: (state) => {
            state.isAuthenticated = false;
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        }
    },
});

export default authSlice.reducer;
export const { setCredentials, clearCredentials } = authSlice.actions;