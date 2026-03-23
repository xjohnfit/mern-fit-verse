import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    StatusBar,
    Keyboard,
    useColorScheme,
    RefreshControl,
} from 'react-native';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import EmptyState from './EmptyState';
import createStyles from '@/styles/chat/ConversationViewStyles';

interface User {
    _id: string;
    name: string;
    username: string;
    photo?: string;
}

interface Message {
    _id: string;
    senderId: string | { _id: string; name: string; username: string; photo?: string; };
    receiverId: string;
    text: string;
    image?: string;
    messageType?: 'text' | 'image' | 'template';
    templateData?: {
        _id: string;
        name: string;
        description?: string;
        exercises: any[];
    };
    createdAt: string;
}

interface ConversationViewProps {
    selectedUser: User;
    currentUserId: string;
    messages: Message[];
    isOnline: boolean;
    onBack: () => void;
    messageText: string;
    setMessageText: (text: string) => void;
    image: string | null;
    setImage: (image: string | null) => void;
    onSend: () => void;
    isSending: boolean;
    isInitialLoad: boolean;
    isLoadingMore: boolean;
    hasMoreMessages: boolean;
    onLoadMore: () => void;
    onRefresh?: () => Promise<void>;
}

const ConversationView: React.FC<ConversationViewProps> = ({
    selectedUser,
    currentUserId,
    messages,
    isOnline,
    onBack,
    messageText,
    setMessageText,
    image,
    setImage,
    onSend,
    isSending,
    isInitialLoad,
    isLoadingMore,
    hasMoreMessages,
    onLoadMore,
    onRefresh,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);
    const flatListRef = useRef<FlatList>(null);
    const scrollTimeoutRef = useRef<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = useCallback(async () => {
        if (onRefresh) {
            setRefreshing(true);
            await onRefresh();
            setRefreshing(false);
        }
    }, [onRefresh]);

    // Scroll to bottom when keyboard shows
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setTimeout(() => {
                    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                }, 100);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    // Auto-scroll to the bottom when new messages arrive (for inverted list, scroll to offset 0)
    const scrollToBottom = useCallback(() => {
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
            if (flatListRef.current && messages.length > 0) {
                flatListRef.current.scrollToOffset({ offset: 0, animated: true });
            }
        }, 100);
    }, [messages.length]);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }

        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [messages.length, scrollToBottom]);

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#06b6d4" />
            <KeyboardAvoidingView
                style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F9FAFB' }]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ChatHeader user={selectedUser} isOnline={isOnline} onBack={onBack} />

                {/* Messages List */}
                {isInitialLoad ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#06b6d4" />
                        <Text style={styles.loadingText}>Loading messages...</Text>
                    </View>
                ) : messages.length === 0 ? (
                    <EmptyState
                        icon="chatbubble-ellipses"
                        title="Start a conversation"
                        subtitle={`Send a message to ${selectedUser.name} to start chatting`}
                    />
                ) : (
                    <FlatList
                        key={selectedUser._id}
                        ref={flatListRef}
                        data={[...messages].reverse()}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.messagesContainer}
                        inverted={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                tintColor="#06b6d4"
                                colors={['#06b6d4']}
                            />
                        }
                        onScroll={(event) => {
                            const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                            const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;

                            // Load more when scrolling near the top (which is bottom in inverted list)
                            if (distanceFromBottom > contentSize.height - 200 && !isLoadingMore && hasMoreMessages) {
                                onLoadMore();
                            }
                        }}
                        scrollEventThrottle={400}
                        ListFooterComponent={
                            isLoadingMore ? (
                                <View style={styles.loadingMoreContainer}>
                                    <ActivityIndicator size="small" color="#06b6d4" />
                                    <Text style={styles.loadingMoreText}>
                                        Loading older messages...
                                    </Text>
                                </View>
                            ) : !hasMoreMessages && messages.length > 0 ? (
                                <View style={styles.noMoreMessagesContainer}>
                                    <Text style={styles.noMoreMessagesText}>
                                        Beginning of conversation
                                    </Text>
                                </View>
                            ) : null
                        }
                        renderItem={({ item }) => {
                            const messageSenderId = typeof item.senderId === 'string'
                                ? item.senderId
                                : item.senderId._id;
                            return (
                                <MessageBubble
                                    message={item}
                                    isMyMessage={messageSenderId === currentUserId}
                                />
                            );
                        }}
                    />
                )}

                <MessageInput
                    messageText={messageText}
                    setMessageText={setMessageText}
                    image={image}
                    setImage={setImage}
                    onSend={onSend}
                    isSending={isSending}
                    recipientName={selectedUser.name}
                />
            </KeyboardAvoidingView>
        </>
    );
};

export default ConversationView;

