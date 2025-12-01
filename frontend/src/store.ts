import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/slices/authSlice';
import socketReducer from '@/slices/socketSlice';
import apiSlice from '@/slices/apiSlice';
import { fatSecretApiSlice } from '@/slices/fatSecretApiSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        socket: socketReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [fatSecretApiSlice.reducerPath]: fatSecretApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(fatSecretApiSlice.middleware),
    devTools: true,
});

export default store;
