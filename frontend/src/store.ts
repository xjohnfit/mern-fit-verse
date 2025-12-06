import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/slices/authSlice';
import socketReducer from '@/slices/socketSlice';
import apiSlice from '@/slices/apiSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        socket: socketReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;
