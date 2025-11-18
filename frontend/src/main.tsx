// React Core
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Router
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

// Redux
import { Provider } from 'react-redux';
import store from './store';

// Theme Provider
import { ThemeProvider } from 'next-themes';

// Styles
import './index.css';

// Main App
import App from './App';

// Public Screens
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Protected Screens
import PrivateRoute from './components/common/PrivateRoute';
import DashboardScreen from './screens/protected/dashboard/DashboardScreen';
import SettingsScreen from './screens/protected/settings/SettingsScreen';
import ViewProfileScreen from './screens/protected/profile/ViewUserProfile';
import NutritionScreen from './screens/protected/nutrition/NutritionScreen';
import WorkoutScreen from './screens/protected/workout/WorkoutScreen';

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