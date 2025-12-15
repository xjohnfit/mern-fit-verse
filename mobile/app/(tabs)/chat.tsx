// React
import { useState, useEffect, useRef } from 'react';

// React Native
import { AppState } from 'react-native';

// Expo
import { useLocalSearchParams } from 'expo-router';

// Redux
import { useSelector, useDispatch } from 'react-redux';

// API Slices
import { useGetUserProfileQuery } from '@/slices/usersApiSlice';
import { useSendMessageMutation, useLazyGetMessagesQuery } from '@/slices/messageApiSlice';

// Hooks
import { getSocket } from '@/hooks/useSocket';

// Utils
import { getCachedMessages, cacheMessages, appendMessageToCache } from '@/lib/messageCache';
import {
  showMessageNotification,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  setBadgeCount,
} from '@/lib/notifications';

// Components
import UserListView from '@/components/chat/UserListView';
import ConversationView from '@/components/chat/ConversationView';

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
  updatedAt?: string;
}

const ChatScreen = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: any) => state.auth);
  const { onlineUsers } = useSelector((state: any) => state.socket);
  const { data: currentUserProfile, isLoading: isLoadingProfile } = useGetUserProfileQuery({});
  const { userId } = useLocalSearchParams<{ userId?: string; }>();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const appState = useRef(AppState.currentState);
  const isLoadingOlderMessages = useRef(false);

  // Handle userId from navigation params
  useEffect(() => {
    if (userId && currentUserProfile?.following) {
      const user = currentUserProfile.following.find((u: User) => u._id === userId);
      if (user) {
        setSelectedUser(user);
      }
    }
  }, [userId, currentUserProfile]);

  // Use lazy query for manual message fetching
  const [fetchMessages] = useLazyGetMessagesQuery();

  // Load cached messages and fetch latest when user is selected
  useEffect(() => {
    const loadMessagesForUser = async () => {
      if (!selectedUser || !userInfo) return;

      setIsInitialLoad(true);
      setHasMoreMessages(true);

      // Load cached messages immediately for instant display
      const cached = await getCachedMessages(userInfo._id, selectedUser._id);

      if (cached && Array.isArray(cached) && cached.length > 0) {
        setAllMessages(cached);
        setIsInitialLoad(false); // Show cached messages immediately without loading the state

        // Still fetch fresh messages in the background to sync
        try {
          const result = await fetchMessages({
            senderId: userInfo._id,
            receiverId: selectedUser._id,
            limit: 50,
          }).unwrap();

          if (result && result.messages && Array.isArray(result.messages)) {
            setAllMessages(result.messages);
            setHasMoreMessages(result.hasMore || false);

            // Update cache with fetched messages
            await cacheMessages(userInfo._id, selectedUser._id, result.messages);
          }
        } catch (error) {
          console.error('Failed to fetch messages in background:', error);
        }
      } else {
        setAllMessages([]);

        // Fetch from API if no cache exists
        try {
          const result = await fetchMessages({
            senderId: userInfo._id,
            receiverId: selectedUser._id,
            limit: 50,
          }).unwrap();

          if (result && result.messages && Array.isArray(result.messages)) {
            setAllMessages(result.messages);
            setHasMoreMessages(result.hasMore || false);

            // Update cache with fetched messages
            await cacheMessages(userInfo._id, selectedUser._id, result.messages);
          } else {
            // Empty result but successful
            setAllMessages([]);
            setHasMoreMessages(false);
          }
        } catch (error) {
          console.error('Failed to fetch messages:', error);
          // Set empty arrays on error
          setAllMessages([]);
          setHasMoreMessages(false);
        } finally {
          setIsInitialLoad(false);
        }
      }
    };

    loadMessagesForUser();
  }, [selectedUser?._id, userInfo?._id]);

  // Display messages - simply show allMessages for the selected user
  const displayMessages = selectedUser ? allMessages : [];

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  // Initialize push notification listeners
  useEffect(() => {
    const notificationListener = addNotificationReceivedListener((notification) => {
      // Notification received
    });

    const responseListener = addNotificationResponseReceivedListener((response) => {
      const senderId = response.notification.request.content.data.senderId;
      if (senderId) {
        // Find user and open chat
        const user = currentUserProfile?.following?.find((u: User) => u._id === senderId);
        if (user) {
          setSelectedUser(user);
        }
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []); // Run only once on mount

  // Listen for real-time messages via socket.io
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = async (message: Message) => {
      // If message is for current user
      if (message.receiverId === userInfo?._id || message.senderId === userInfo?._id) {
        const otherUserId = message.senderId === userInfo._id ? message.receiverId : message.senderId;

        // Update cache with new message
        await appendMessageToCache(userInfo._id, otherUserId, message);

        // If viewing this conversation, add to displayed messages (avoiding duplicates)
        if (selectedUser?._id === otherUserId) {
          setAllMessages(prev => {
            // Avoid duplicates by checking if message ID already exists
            const exists = prev.some(m => m._id === message._id);
            if (exists) return prev;
            return [...prev, message];
          });
        }
      }

      // Show push notification if message is from another user and not viewing that conversation
      if (
        message.senderId !== userInfo?._id &&
        message.receiverId === userInfo?._id &&
        message.senderId !== selectedUser?._id
      ) {
        const sender = currentUserProfile?.following?.find(
          (u: User) => u._id === message.senderId
        );
        if (sender) {
          await showMessageNotification(sender.name, message.text, sender._id);
        }
      }
    };

    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [selectedUser?._id, userInfo?._id, dispatch]); // Only depend on IDs, not full objects

  // Track app state for notifications
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      appState.current = nextAppState;
      if (nextAppState === 'active') {
        setBadgeCount(0);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !image) || !userInfo || !selectedUser) return;

    try {
      const sentMessage = await sendMessage({
        senderId: userInfo._id,
        receiverId: selectedUser._id,
        text: messageText.trim(),
        ...(image && { image }),
      }).unwrap();

      // Add sent message to local state immediately
      setAllMessages(prev => {
        // Check if message already exists (shouldn't, but just in case)
        const exists = prev.some(m => m._id === sentMessage._id);
        if (exists) return prev;
        return [...prev, sentMessage];
      });

      // Update cache
      await appendMessageToCache(userInfo._id, selectedUser._id, sentMessage);

      setMessageText('');
      setImage(null);
    } catch (error: any) {
      console.error('Failed to send message:', error);
    }
  };



  // Load older messages when scrolling to the top
  const loadOlderMessages = async () => {
    if (!selectedUser || !userInfo || !hasMoreMessages || isLoadingOlderMessages.current || allMessages.length === 0) {
      return;
    }

    isLoadingOlderMessages.current = true;
    setIsLoadingMore(true);

    try {
      // Get the oldest message timestamp
      const oldestMessage = allMessages[0];
      const result = await fetchMessages({
        senderId: userInfo._id,
        receiverId: selectedUser._id,
        limit: 50,
        before: oldestMessage.createdAt,
      }).unwrap();

      if (result && result.messages && Array.isArray(result.messages) && result.messages.length > 0) {
        // Prepend older messages to the list, removing any duplicates
        setAllMessages(prev => {
          const existingIds = new Set(prev.map(m => m._id));
          const newMessages = result.messages.filter(m => !existingIds.has(m._id));
          return [...newMessages, ...prev];
        });
        setHasMoreMessages(result.hasMore || false);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Failed to load older messages:', error);
    } finally {
      setIsLoadingMore(false);
      isLoadingOlderMessages.current = false;
    }
  };

  const filteredUsers = currentUserProfile?.following?.filter((user: User) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // User List View
  if (!selectedUser) {
    return (
      <UserListView
        users={filteredUsers || []}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onlineUsers={onlineUsers}
        onUserSelect={setSelectedUser}
        isLoading={isLoadingProfile}
      />
    );
  }

  // Conversation View
  const isUserOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return (
    <ConversationView
      selectedUser={selectedUser}
      currentUserId={userInfo._id}
      messages={displayMessages}
      isOnline={isUserOnline}
      onBack={() => setSelectedUser(null)}
      messageText={messageText}
      setMessageText={setMessageText}
      image={image}
      setImage={setImage}
      onSend={handleSendMessage}
      isSending={isSending}
      isInitialLoad={isInitialLoad}
      isLoadingMore={isLoadingMore}
      hasMoreMessages={hasMoreMessages}
      onLoadMore={loadOlderMessages}
    />
  );
};

export default ChatScreen;
