import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import store from './store';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';

import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import EditProfileScreen from './screens/dashboard/EditProfileScreen';
import ViewProfileScreen from './screens/dashboard/ViewUserProfile';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, Component: HomeScreen },
            { path: '/login', Component: LoginScreen },
            { path: '/register', Component: RegisterScreen },

            // Protected Routes
            {
                element: <PrivateRoute />,
                children: [
                    { path: '/dashboard', Component: DashboardScreen },
                    { path: "/profile", Component: EditProfileScreen },
                    { path: "/profile/view/:username", Component: ViewProfileScreen },
                ],
            },
            // End Protected Routes
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <StrictMode>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                <RouterProvider router={router} />
            </ThemeProvider>
        </StrictMode>
    </Provider>
);