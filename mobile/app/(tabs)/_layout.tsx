import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/hooks/useRedux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

type TabBarIconProps = {
    name: keyof typeof Ionicons.glyphMap;
    color: string;
    focused: boolean;
};

const TabBarIcon = ({ name, color, focused }: TabBarIconProps) => {
    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 52,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? `${color}20` : 'transparent',
            }}
        >
            <Ionicons
                name={name}
                size={24}
                color={color}
            />
        </View>
    );
};

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
                name='dashboard'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name='grid' color='#3b82f6' focused={focused} />
                    ),
                    tabBarActiveTintColor: '#3b82f6',
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name='person' color='#ec4899' focused={focused} />
                    ),
                    tabBarActiveTintColor: '#ec4899',
                }}
            />
            <Tabs.Screen
                name='chat'
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name='chatbubble' color='#06b6d4' focused={focused} />
                    ),
                    tabBarActiveTintColor: '#06b6d4',
                }}
            />
            <Tabs.Screen
                name='nutrition'
                options={{
                    title: 'Nutrition',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name='nutrition' color='#10b981' focused={focused} />
                    ),
                    tabBarActiveTintColor: '#10b981',
                }}
            />
            <Tabs.Screen
                name='workout'
                options={{
                    title: 'Workout',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name='barbell' color='#a855f7' focused={focused} />
                    ),
                    tabBarActiveTintColor: '#a855f7',
                }}
            />
            <Tabs.Screen
                name='settings'
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name='settings' color='#6366f1' focused={focused} />
                    ),
                    tabBarActiveTintColor: '#6366f1',
                }}
            />
        </Tabs>
    );
}