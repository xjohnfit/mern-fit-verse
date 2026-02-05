import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/hooks/useRedux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';
import { useGetUsersWithMessagesQuery } from '@/slices/messageApiSlice';

type TabBarIconProps = {
    name: keyof typeof Ionicons.glyphMap;
    color: string;
    focused: boolean;
    badge?: number;
};

const TabBarIcon = ({ name, color, focused, badge }: TabBarIconProps) => {
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
            {badge !== undefined && badge > 0 && (
                <View
                    style={{
                        position: 'absolute',
                        top: -4,
                        right: 6,
                        backgroundColor: '#ef4444',
                        borderRadius: 10,
                        minWidth: 20,
                        height: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 5,
                        borderWidth: 2,
                        borderColor: '#111827',
                    }}
                >
                    <Text
                        style={{
                            color: '#ffffff',
                            fontSize: 11,
                            fontWeight: 'bold',
                        }}
                    >
                        {badge > 99 ? '99+' : badge}
                    </Text>
                </View>
            )}
        </View>
    );
};

export default function TabsLayout() {
    const { userInfo } = useAppSelector((state) => state.auth);

    const insets = useSafeAreaInsets();

    // Get users with messages to count unread conversations
    const { data: usersWithMessages } = useGetUsersWithMessagesQuery(
        userInfo?._id ?? '',
        { skip: !userInfo?._id }
    );

    // Count conversations with unread messages
    const unreadCount = usersWithMessages?.filter((user: any) => user.hasUnreadMessage).length || 0;

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
                        <TabBarIcon name='chatbubble' color='#06b6d4' focused={focused} badge={unreadCount} />
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
                    href: null,
                }}
            />
        </Tabs>
    );
}