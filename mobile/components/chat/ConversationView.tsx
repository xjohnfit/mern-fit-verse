import React, { useRef, useEffect, useCallback, useMemo } from 'react';
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
    senderId: string;
    receiverId: string;
    text: string;
    image?: string;
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
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = useMemo(() => createStyles(isDark), [isDark]);
    const flatListRef = useRef<FlatList>(null);
    const scrollTimeoutRef = useRef<any>(null);

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
                        renderItem={({ item }) => (
                            <MessageBubble
                                message={item}
                                isMyMessage={item.senderId === currentUserId}
                            />
                        )}
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

