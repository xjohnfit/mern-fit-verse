import React, { useMemo } from 'react';
import { View, Text, Image, useColorScheme } from 'react-native';
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

    return (
        <View style={styles.container}>
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
        </View>
    );
};

export default MessageBubble;

