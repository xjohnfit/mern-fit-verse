import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
    _id: string;
    senderId:
        | string
        | { _id: string; name: string; username: string; photo?: string };
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
    updatedAt?: string;
}

const MESSAGE_CACHE_PREFIX = 'messages_cache_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedMessages {
    messages: Message[];
    lastFetch: number;
    conversationId: string;
}

/**
 * Generate a unique cache key for a conversation between two users
 */
const getCacheKey = (userId1: string, userId2: string): string => {
    // Sort IDs to ensure consistent key regardless of who is sender/receiver
    const sortedIds = [userId1, userId2].sort();
    return `${MESSAGE_CACHE_PREFIX}${sortedIds[0]}_${sortedIds[1]}`;
};

/**
 * Save messages to cache for a conversation
 */
export const cacheMessages = async (
    currentUserId: string,
    otherUserId: string,
    messages: Message[],
): Promise<void> => {
    try {
        const cacheKey = getCacheKey(currentUserId, otherUserId);
        const cacheData: CachedMessages = {
            messages,
            lastFetch: Date.now(),
            conversationId: `${currentUserId}_${otherUserId}`,
        };
        await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error caching messages:', error);
    }
};

/**
 * Get cached messages for a conversation
 * Returns null if cache doesn't exist or is expired
 */
export const getCachedMessages = async (
    currentUserId: string,
    otherUserId: string,
): Promise<Message[] | null> => {
    try {
        const cacheKey = getCacheKey(currentUserId, otherUserId);
        const cachedData = await AsyncStorage.getItem(cacheKey);

        if (!cachedData) {
            return null;
        }

        const parsed: CachedMessages = JSON.parse(cachedData);

        // Validate cache data structure
        if (!parsed || !parsed.messages || !Array.isArray(parsed.messages)) {
            await AsyncStorage.removeItem(cacheKey);
            return null;
        }

        // Check if cache is expired (older than 24 hours)
        const isExpired = Date.now() - parsed.lastFetch > CACHE_DURATION;
        if (isExpired) {
            // Remove expired cache
            await AsyncStorage.removeItem(cacheKey);
            return null;
        }

        // Filter messages from last 24 hours
        const oneDayAgo = Date.now() - CACHE_DURATION;
        const recentMessages = parsed.messages.filter(
            (msg) =>
                msg &&
                msg.createdAt &&
                new Date(msg.createdAt).getTime() > oneDayAgo,
        );

        return recentMessages;
    } catch (error) {
        console.error('Error getting cached messages:', error);
        return null;
    }
};

/**
 * Update cache with new messages (e.g., from socket.io)
 */
export const appendMessageToCache = async (
    currentUserId: string,
    otherUserId: string,
    newMessage: Message,
): Promise<void> => {
    try {
        const cachedMessages = await getCachedMessages(
            currentUserId,
            otherUserId,
        );
        if (cachedMessages && Array.isArray(cachedMessages)) {
            // Check if message already exists
            const messageExists = cachedMessages.some(
                (msg) => msg._id === newMessage._id,
            );
            if (!messageExists) {
                const updatedMessages = [...cachedMessages, newMessage];
                await cacheMessages(
                    currentUserId,
                    otherUserId,
                    updatedMessages,
                );
            }
        } else {
            // No cache exists, create new cache with this message
            await cacheMessages(currentUserId, otherUserId, [newMessage]);
        }
    } catch (error) {
        console.error('Error appending message to cache:', error);
    }
};

/**
 * Clear all message caches (useful on logout)
 */
export const clearAllMessageCaches = async (): Promise<void> => {
    try {
        const allKeys = await AsyncStorage.getAllKeys();
        const messageCacheKeys = allKeys.filter((key) =>
            key.startsWith(MESSAGE_CACHE_PREFIX),
        );
        await AsyncStorage.multiRemove(messageCacheKeys);
    } catch (error) {
        console.error('Error clearing message caches:', error);
    }
};

/**
 * Clear cache for a specific conversation
 */
export const clearConversationCache = async (
    currentUserId: string,
    otherUserId: string,
): Promise<void> => {
    try {
        const cacheKey = getCacheKey(currentUserId, otherUserId);
        await AsyncStorage.removeItem(cacheKey);
    } catch (error) {
        console.error('Error clearing conversation cache:', error);
    }
};
