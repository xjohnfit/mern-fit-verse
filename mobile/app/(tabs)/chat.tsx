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
} from 'react-native';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useGetUserProfileQuery } from '@/slices/usersApiSlice';
import { useGetMessagesQuery, useSendMessageMutation } from '@/slices/messageApiSlice';
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
}

const ChatScreen = () => {
  const insets = useSafeAreaInsets();
  const { userInfo } = useSelector((state: any) => state.auth);
  const { data: currentUserProfile, isLoading: isLoadingProfile } = useGetUserProfileQuery({});

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);

  const flatListRef = useRef<FlatList>(null);
  const appState = useRef(AppState.currentState);

  // Fetch messages for selected user
  const { data: messages = [], isLoading: isLoadingMessages } = useGetMessagesQuery(
    {
      senderId: userInfo?._id || '',
      receiverId: selectedUser?._id || '',
    },
    {
      skip: !userInfo || !selectedUser,
    }
  );

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  // Initialize push notifications
  useEffect(() => {
    registerForPushNotificationsAsync();

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

  // Update local messages when query data changes - use useMemo to prevent unnecessary updates
  useMemo(() => {
    if (messages.length > 0) {
      setAllMessages(messages);
    }
  }, [messages.length, selectedUser?._id]);

  // Listen for real-time messages via socket.io
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = async (message: Message) => {
      // Only add message if it's part of the current conversation
      if (
        (message.senderId === selectedUser?._id && message.receiverId === userInfo?._id) ||
        (message.senderId === userInfo?._id && message.receiverId === selectedUser?._id)
      ) {
        setAllMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
      }

      // Show push notification if message is from another user and app is in background
      if (
        message.senderId !== userInfo?._id &&
        message.receiverId === userInfo?._id &&
        appState.current !== 'active'
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
  }, [selectedUser?._id, userInfo?._id]); // Only depend on IDs, not full objects

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

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (allMessages.length > 0) {
      scrollToBottom();
    }
  }, [allMessages.length, scrollToBottom]);

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !image) || !userInfo || !selectedUser) return;

    try {
      await sendMessage({
        senderId: userInfo._id,
        receiverId: selectedUser._id,
        text: messageText.trim(),
        ...(image && { image }),
      }).unwrap();

      setMessageText('');
      setImage(null);
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

  const filteredUsers = currentUserProfile?.following?.filter((user: User) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', marginBottom: 12 }}>
            Messages
          </Text>

          {/* Search */}
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}>
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              placeholder="Search messages..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, marginLeft: 8, fontSize: 16, color: '#1f2937' }}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Users List */}
        {isLoadingProfile ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading...</Text>
          </View>
        ) : filteredUsers && filteredUsers.length > 0 ? (
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedUser(item)}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
              >
                {item.photo ? (
                  <Image
                    source={{ uri: item.photo }}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                ) : (
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#667eea', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                      {getInitials(item.name)}
                    </Text>
                  </View>
                )}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>
                    @{item.username}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
            <Ionicons name="chatbubbles-outline" size={64} color="#d1d5db" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#6b7280', marginTop: 16 }}>
              {searchQuery ? 'No users found' : 'No conversations yet'}
            </Text>
            <Text style={{ fontSize: 14, color: '#9ca3af', marginTop: 8, textAlign: 'center' }}>
              {searchQuery
                ? 'Try searching for a different user'
                : 'Start following people to message them'}
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Conversation View
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      {/* Header */}
      <View style={{ paddingTop: insets.top, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => setSelectedUser(null)} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        {selectedUser.photo ? (
          <Image
            source={{ uri: selectedUser.photo }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        ) : (
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#667eea', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
              {getInitials(selectedUser.name)}
            </Text>
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>
            {selectedUser.name}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            @{selectedUser.username}
          </Text>
        </View>
      </View>

      {/* Messages List */}
      {isLoadingMessages ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={{ marginTop: 12, color: '#6b7280' }}>Loading messages...</Text>
        </View>
      ) : allMessages.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#ede9fe', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="chatbubble-ellipses" size={40} color="#667eea" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937', marginBottom: 8 }}>
            Start a conversation
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center' }}>
            Send a message to {selectedUser.name} to start chatting
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={allMessages}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, flexGrow: 1 }}
          inverted={false}
          onContentSizeChange={() => {
            if (flatListRef.current && allMessages.length > 0) {
              flatListRef.current.scrollToEnd({ animated: false });
            }
          }}
          onLayout={() => {
            if (flatListRef.current && allMessages.length > 0) {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
              }, 100);
            }
          }}
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
                    backgroundColor: isMyMessage ? '#667eea' : '#f3f4f6',
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
                      color: isMyMessage ? '#fff' : '#1f2937',
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
        <View style={{ paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
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
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f3f4f6',
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
                fontSize: 16,
                color: '#1f2937',
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
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center', marginRight: 8 }}
          >
            <Ionicons name="image" size={20} color="#667eea" />
          </TouchableOpacity>

          {/* Send Button */}
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={(!messageText.trim() && !image) || isSending}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: (!messageText.trim() && !image) || isSending ? '#d1d5db' : '#667eea',
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
  );
};

export default ChatScreen;
