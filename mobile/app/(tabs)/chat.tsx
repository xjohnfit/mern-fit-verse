import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  AppState,
  useColorScheme,
  StatusBar,
  Keyboard,
} from 'react-native';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useGetUserProfileQuery } from '@/slices/usersApiSlice';
import { useGetMessagesQuery, useSendMessageMutation, useLazyGetMessagesQuery } from '@/slices/messageApiSlice';
import { useDispatch } from 'react-redux';
import { apiSlice } from '@/slices/apiSlice';
import {
  getCachedMessages,
  cacheMessages,
  appendMessageToCache,
} from '@/lib/messageCache';
import type { Message as CachedMessage } from '@/lib/messageCache';
import { getSocket } from '@/hooks/useSocket';
import {
  registerForPushNotificationsAsync,
  showMessageNotification,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  setBadgeCount,
} from '@/lib/notifications';

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
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
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
  const [cachedMessages, setCachedMessages] = useState<Message[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const flatListRef = useRef<FlatList>(null);
  const appState = useRef(AppState.currentState);
  const isLoadingOlderMessages = useRef(false);
  const scrollTimeoutRef = useRef<any>(null);

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
  const [fetchMessages, { data: messagesData, isLoading: isLoadingMessages, isFetching }] = useLazyGetMessagesQuery();

  // Load cached messages and fetch latest when user is selected
  useEffect(() => {
    const loadMessagesForUser = async () => {
      if (!selectedUser || !userInfo) return;

      setIsInitialLoad(true);
      setHasMoreMessages(true);

      // Load cached messages immediately for instant display
      const cached = await getCachedMessages(userInfo._id, selectedUser._id);
      console.log('📦 Loaded from cache:', cached?.length || 0, 'messages');

      if (cached && Array.isArray(cached) && cached.length > 0) {
        setCachedMessages(cached);
        setAllMessages(cached);
        setIsInitialLoad(false); // Show cached messages immediately without loading state
      } else {
        setCachedMessages([]);
        setAllMessages([]);

        // Only fetch from API if no cache exists
        try {
          const result = await fetchMessages({
            senderId: userInfo._id,
            receiverId: selectedUser._id,
            limit: 50,
          }).unwrap();

          console.log('🌐 Fetched from API (no cache):', result?.messages?.length || 0, 'messages');

          if (result && result.messages && Array.isArray(result.messages)) {
            setAllMessages(result.messages);
            setHasMoreMessages(result.hasMore || false);

            // Update cache with fetched messages
            await cacheMessages(userInfo._id, selectedUser._id, result.messages);
            console.log('💾 Saved to cache:', result.messages.length, 'messages');
          }
        } catch (error) {
          console.error('Failed to fetch messages:', error);
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
      console.log('Notification received:', notification);
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

  // Scroll to bottom when keyboard shows
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    // Clear any pending scroll timeouts
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Schedule scroll with a slight delay to ensure content is rendered
    scrollTimeoutRef.current = setTimeout(() => {
      if (flatListRef.current && displayMessages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 150);
  }, [displayMessages.length]);

  useEffect(() => {
    if (displayMessages.length > 0) {
      scrollToBottom();
    }

    // Cleanup timeout on unmount
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [displayMessages.length, scrollToBottom]);

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

      // Scroll to bottom after sending with longer delay to ensure render is complete
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    } catch (error: any) {
      console.error('Failed to send message:', error);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  // Load older messages when scrolling to top
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

  // Sort users: online users first, then offline users
  const sortedUsers = filteredUsers?.sort((a: User, b: User) => {
    const aOnline = onlineUsers.includes(a._id);
    const bOnline = onlineUsers.includes(b._id);
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;
    return 0;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // User List View
  if (!selectedUser) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#059669" />
        <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#111827' : '#F9FAFB' }}>
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#059669', '#10b981', '#34d399']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingHorizontal: 20, paddingTop: insets.top + 20, paddingBottom: 28 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                <Ionicons name="chatbubbles" size={32} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 }}>
                  Messages
                </Text>
                <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.95)', fontWeight: '500' }}>
                  Chat with your connections
                </Text>
              </View>
            </View>

            {/* Search */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}>
              <Ionicons name="search" size={20} color="#FFFFFF" />
              <TextInput
                placeholder="Search messages..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ flex: 1, marginLeft: 8, fontSize: 16, color: '#FFFFFF' }}
                placeholderTextColor="rgba(255,255,255,0.8)"
              />
            </View>
          </LinearGradient>

          {/* Users List */}
          {isLoadingProfile ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading...</Text>
            </View>
          ) : sortedUsers && sortedUsers.length > 0 ? (
            <FlatList
              data={sortedUsers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => {
                const isOnline = onlineUsers.includes(item._id);
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedUser(item)}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF', marginHorizontal: 16, marginVertical: 4, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}
                  >
                    <View style={{ position: 'relative' }}>
                      {item.photo ? (
                        <Image
                          source={{ uri: item.photo }}
                          style={{ width: 52, height: 52, borderRadius: 26 }}
                        />
                      ) : (
                        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                            {getInitials(item.name)}
                          </Text>
                        </View>
                      )}
                      {isOnline ? (
                        <View style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderRadius: 8, backgroundColor: '#3B82F6', borderWidth: 2, borderColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }} />
                      ) : (
                        <View style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderRadius: 8, backgroundColor: '#6B7280', borderWidth: 2, borderColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF' }} />
                      )}
                    </View>
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={{ fontSize: 17, fontWeight: '600', color: colorScheme === 'dark' ? '#f9fafb' : '#1f2937' }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: 14, color: isOnline ? '#3B82F6' : '#6b7280', marginTop: 2, fontWeight: '500' }}>
                        {isOnline ? 'Online' : 'Offline'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color="#10b981" />
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={{ paddingVertical: 12 }}
            />
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colorScheme === 'dark' ? '#374151' : '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
                <Ionicons name="chatbubbles-outline" size={40} color="#10b981" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colorScheme === 'dark' ? '#f9fafb' : '#1f2937', marginTop: 8 }}>
                {searchQuery ? 'No users found' : 'No conversations yet'}
              </Text>
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center' }}>
                {searchQuery
                  ? 'Try searching for a different user'
                  : 'Start following people to message them'}
              </Text>
            </View>
          )}
        </View>
      </>
    );
  }

  // Conversation View
  const isUserOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#111827' : '#F9FAFB' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#059669', '#10b981', '#34d399']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' }}
        >
          <TouchableOpacity onPress={() => setSelectedUser(null)} style={{ marginRight: 12, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ position: 'relative' }}>
            {selectedUser.photo ? (
              <Image
                source={{ uri: selectedUser.photo }}
                style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' }}
              />
            ) : (
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.35)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                  {getInitials(selectedUser.name)}
                </Text>
              </View>
            )}
            {isUserOnline ? (
              <View style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#3B82F6', borderWidth: 2, borderColor: '#10b981' }} />
            ) : (
              <View style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#6B7280', borderWidth: 2, borderColor: '#10b981' }} />
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>
              {selectedUser.name}
            </Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>
              {isUserOnline ? 'Online' : `@${selectedUser.username}`}
            </Text>
          </View>
        </LinearGradient>

        {/* Messages List */}
        {isInitialLoad && cachedMessages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading messages...</Text>
          </View>
        ) : displayMessages.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colorScheme === 'dark' ? '#374151' : '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <Ionicons name="chatbubble-ellipses" size={40} color="#10b981" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colorScheme === 'dark' ? '#f9fafb' : '#1f2937', marginBottom: 8 }}>
              Start a conversation
            </Text>
            <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
              Send a message to {selectedUser.name} to start chatting
            </Text>
          </View>
        ) : (
          <FlatList
            key={selectedUser._id}
            ref={flatListRef}
            data={displayMessages}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, flexGrow: 1, justifyContent: 'flex-end' }}
            inverted={false}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
            }}
            onScroll={(event) => {
              const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
              // Check if scrolled near the top (within 100 pixels)
              if (contentOffset.y < 100 && !isLoadingMore && hasMoreMessages) {
                loadOlderMessages();
              }
            }}
            scrollEventThrottle={400}
            ListHeaderComponent={
              isLoadingMore ? (
                <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color="#10b981" />
                  <Text style={{ marginTop: 8, color: '#6b7280', fontSize: 12 }}>Loading older messages...</Text>
                </View>
              ) : !hasMoreMessages && displayMessages.length > 0 ? (
                <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                  <Text style={{ color: '#9ca3af', fontSize: 12 }}>No more messages</Text>
                </View>
              ) : null
            }
            renderItem={({ item }) => {
              const isMyMessage = item.senderId === userInfo?._id;
              return (
                <View
                  style={{
                    marginBottom: 12,
                    alignItems: isMyMessage ? 'flex-end' : 'flex-start',
                  }}
                >
                  <View
                    style={{
                      maxWidth: '80%',
                      borderRadius: 16,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      backgroundColor: isMyMessage ? '#10b981' : (colorScheme === 'dark' ? '#1f2937' : '#FFFFFF'),
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    {item.image && (
                      <Image
                        source={{ uri: item.image }}
                        style={{ width: 200, height: 200, borderRadius: 12, marginBottom: 8 }}
                        resizeMode="cover"
                      />
                    )}
                    <Text
                      style={{
                        fontSize: 15,
                        color: isMyMessage ? '#fff' : (colorScheme === 'dark' ? '#f9fafb' : '#1f2937'),
                        lineHeight: 20,
                      }}
                    >
                      {item.text}
                    </Text>
                    {item.createdAt && (
                      <Text
                        style={{
                          fontSize: 10,
                          color: isMyMessage ? 'rgba(255,255,255,0.8)' : '#9ca3af',
                          marginTop: 4,
                        }}
                      >
                        {new Date(item.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}

        {/* Image Preview */}
        {image && (
          <View style={{ paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb' }}>
            <View style={{ position: 'relative' }}>
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100, borderRadius: 12 }}
              />
              <TouchableOpacity
                onPress={() => setImage(null)}
                style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: 12, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center' }}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Message Input */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#f3f4f6',
                borderRadius: 24,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 8,
              }}
            >
              <TextInput
                placeholder={`Message ${selectedUser.name}...`}
                value={messageText}
                onChangeText={setMessageText}
                multiline
                maxLength={500}
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: colorScheme === 'dark' ? '#f9fafb' : '#1f2937',
                  maxHeight: 100,
                  paddingVertical: 4,
                }}
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Image Button */}
            <TouchableOpacity
              onPress={handlePickImage}
              disabled={isSending}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#D1FAE5', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}
            >
              <Ionicons name="image" size={20} color="#10b981" />
            </TouchableOpacity>

            {/* Send Button */}
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={(!messageText.trim() && !image) || isSending}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: (!messageText.trim() && !image) || isSending ? '#d1d5db' : '#10b981',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default ChatScreen;
