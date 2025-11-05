import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import store from './store';
import { Provider } from 'react-redux';

import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen.tsx';
import RegisterScreen from './screens/RegisterScreen.tsx';
import DashboardScreen from './screens/dashboard/DashboardScreen.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, Component: HomeScreen },
            { path: '/login', Component: LoginScreen },
            { path: '/register', Component: RegisterScreen },
            { path: '/dashboard', Component: DashboardScreen },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <StrictMode>
            <RouterProvider router={router} />
        </StrictMode>
    </Provider>
);