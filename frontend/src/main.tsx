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
import PrivacyPolicy from './screens/PrivacyPolicy';
import TermsOfService from './screens/TermsOfService';

// Protected Screens
import PrivateRoute from './components/common/PrivateRoute';
import AdminScreen from './screens/protected/admin/AdminScreen';
import DashboardScreen from './screens/protected/dashboard/DashboardScreen';
import SettingsScreen from './screens/protected/settings/SettingsScreen';
import ViewProfileScreen from './screens/protected/profile/ViewUserProfile';
import NutritionScreen from './screens/protected/nutrition/NutritionScreen';
import WorkoutScreen from './screens/protected/workout/WorkoutScreen';
import StartWorkoutScreen from './screens/protected/workout/StartWorkoutScreen';
import WorkoutDetailScreen from './screens/protected/workout/WorkoutDetailScreen';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [

            // Public Routes
            { index: true, Component: HomeScreen },
            { path: '/login', Component: LoginScreen },
            { path: '/register', Component: RegisterScreen },
            { path: '/privacy-policy', Component: PrivacyPolicy },
            { path: '/terms-of-service', Component: TermsOfService },
            // End Public Routes

            // Private Routes
            {
                element: <PrivateRoute />,
                children: [
                    { path: '/admin', Component: AdminScreen },
                    { path: '/dashboard', Component: DashboardScreen },
                    { path: "/settings", Component: SettingsScreen },
                    { path: "/profile/view/:username", Component: ViewProfileScreen },
                    { path: '/nutrition', Component: NutritionScreen },
                    { path: '/workout', Component: WorkoutScreen },
                    { path: '/workout/start', Component: StartWorkoutScreen },
                    { path: '/workout/:id', Component: WorkoutDetailScreen },
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