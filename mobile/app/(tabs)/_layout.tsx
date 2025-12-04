import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/hooks/useRedux';

export default function TabsLayout() {
    const { userInfo } = useAppSelector((state) => state.auth);

    if(!userInfo) {
        return 
    }


    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name='home'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name='grid'
                            size={30}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name='person'
                            size={30}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='messages'
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name='chatbubble'
                            size={30}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='nutrition'
                options={{
                    title: 'Nutrition',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name='nutrition'
                            size={30}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='workout'
                options={{
                    title: 'Workout',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name='barbell'
                            size={30}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='notifications'
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name='notifications'
                            size={30}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name='settings'
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name='settings'
                            size={30}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
