import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import store from './store';

import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

// Public routes imports
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Private routes imports
import PrivateRoute from './components/PrivateRoute';
import DashboardScreen from './screens/protected/DashboardScreen.tsx';
import SettingsScreen from './screens/protected/SettingsScreen.tsx';
import ViewProfileScreen from './screens/protected/ViewUserProfile.tsx';
import NutritionScreen from './screens/protected/NutritionScreen.tsx';
import WorkoutScreen from './screens/protected/WorkoutScreen.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [

            // Public Routes
            { index: true, Component: HomeScreen },
            { path: '/login', Component: LoginScreen },
            { path: '/register', Component: RegisterScreen },

            // Private Routes
            {
                element: <PrivateRoute />,
                children: [
                    { path: '/dashboard', Component: DashboardScreen },
                    { path: "/settings", Component: SettingsScreen },
                    { path: "/profile/view/:username", Component: ViewProfileScreen },
                    { path: '/nutrition', Component: NutritionScreen },
                    { path: '/workout', Component: WorkoutScreen },
                ],
            },
            // End Private Routes
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <StrictMode>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                <RouterProvider router={router} />
            </ThemeProvider>
        </StrictMode>
    </Provider>
);