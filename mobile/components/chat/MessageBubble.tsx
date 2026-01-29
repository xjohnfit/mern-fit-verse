import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, Image, useColorScheme, Animated } from 'react-native';
import createStyles from '@/styles/chat/MessageBubbleStyles';

interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
    createdAt: string;
}

interface MessageBubbleProps {
    message: Message;
    isMyMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMyMessage }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark, isMyMessage), [isDark, isMyMessage]);

    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity,
                    transform: [{ translateY }],
                }
            ]}
        >
            <View style={styles.bubble}>
                {message.image && (
                    <Image
                        source={{ uri: message.image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}
                <Text
                    style={[
                        styles.text,
                        {
                            color: isMyMessage
                                ? '#fff'
                                : isDark
                                    ? '#f9fafb'
                                    : '#1f2937',
                        },
                    ]}
                >
                    {message.text}
                </Text>
                {message.createdAt && (
                    <Text
                        style={[
                            styles.timestamp,
                            {
                                color: isMyMessage
                                    ? 'rgba(255,255,255,0.8)'
                                    : '#9ca3af',
                            },
                        ]}
                    >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Text>
                )}
            </View>
        </Animated.View>
    );
};

export default MessageBubble;

