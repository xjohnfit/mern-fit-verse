import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/hooks/useRedux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
    const { userInfo } = useAppSelector((state) => state.auth);

    const insets = useSafeAreaInsets();

    if (!userInfo) {
        return;
    }

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#6366f1',
            tabBarInactiveTintColor: '#94a3b8',
            tabBarStyle: {
                backgroundColor: '#111827',
                borderTopWidth: 0,
                height: 50 + insets.bottom,
                overflow: 'hidden',
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            tabBarItemStyle: {
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 4,
            },
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '700',
                marginTop: 4,
                letterSpacing: 0.3,
            },
            headerShown: false,
        }}>
            <Tabs.Screen
                name='home'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name='grid'
                            size={24}
                            color='#3b82f6'
                        />
                    ),
                    tabBarActiveTintColor: '#3b82f6',
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name='person'
                            size={24}
                            color='#ec4899'
                        />
                    ),
                    tabBarActiveTintColor: '#ec4899',
                }}
            />
            <Tabs.Screen
                name='messages'
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name='chatbubble'
                            size={24}
                            color='#10b981'
                        />
                    ),
                    tabBarActiveTintColor: '#10b981',
                }}
            />
            <Tabs.Screen
                name='nutrition'
                options={{
                    title: 'Nutrition',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name='nutrition'
                            size={24}
                            color='#f59e0b'
                        />
                    ),
                    tabBarActiveTintColor: '#f59e0b',
                }}
            />
            <Tabs.Screen
                name='workout'
                options={{
                    title: 'Workout',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name='barbell'
                            size={24}
                            color='#a855f7'
                        />
                    ),
                    tabBarActiveTintColor: '#a855f7',
                }}
            />
            <Tabs.Screen
                name='settings'
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name='settings'
                            size={24}
                            color='#6366f1'
                        />
                    ),
                    tabBarActiveTintColor: '#6366f1',
                }}
            />
        </Tabs>
    );
}