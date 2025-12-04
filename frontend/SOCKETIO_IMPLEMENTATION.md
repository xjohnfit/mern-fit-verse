# Socket.IO Real-Time Messaging Implementation

## Overview
This implementation provides real-time messaging functionality using Socket.IO, allowing users to send and receive messages instantly without page refreshes.

## Architecture

### Backend (Socket.IO Server)

**File**: `backend/config/socket.io.ts`

#### Features:
- **User Connection Tracking**: Maintains a map of online users (userId → socketId)
- **Events**:
  - `user-online`: Emitted by client when user authenticates
  - `disconnect`: Automatically emitted when client disconnects
  - `online-users`: Broadcasted to all clients when online users change
  - `new-message`: Sent to specific receiver when a message is created

#### Key Functions:
- `getReceiverSocketId(userId)`: Helper to get socket ID for a user

### Backend (Message Controller)

**File**: `backend/controllers/messageController.ts`

- After saving a message, emits `new-message` event to the receiver if they're online
- Uses `io.to(socketId).emit()` for targeted message delivery

### Frontend (Socket Management)

**File**: `frontend/src/hooks/useSocket.ts`

#### Features:
- **Automatic Connection**: Connects when user is authenticated
- **Automatic Disconnection**: Disconnects on logout
- **Event Listeners**:
  - `connect`: Notifies server user is online
  - `disconnect`: Updates Redux state
  - `online-users`: Updates online users list in Redux

**File**: `frontend/src/slices/socketSlice.ts`

Redux slice managing:
- `onlineUsers[]`: Array of online user IDs
- `isConnected`: Boolean connection status

### Frontend (Real-Time Messages)

**File**: `frontend/src/screens/protected/messages/components/MessagesList.tsx`

#### Features:
- **Local State Management**: Maintains `allMessages` array
- **Real-Time Updates**: Listens for `new-message` events
- **Duplicate Prevention**: Checks if message already exists before adding
- **Auto-Scroll**: Scrolls to bottom when new messages arrive
- **Conversation Filtering**: Only shows messages for current conversation

## Flow Diagram

```
User A sends message
    ↓
Frontend → Backend API (POST /api/messages/send)
    ↓
Message saved to database
    ↓
Backend emits "new-message" via Socket.IO
    ↓
User B's socket receives event
    ↓
Message added to local state
    ↓
UI updates instantly
```

## Usage

### Starting the Application

1. **Backend**: The Socket.IO server starts automatically with Express
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend**: Socket connection initialized in `App.tsx`
   ```bash
   cd frontend
   npm run dev
   ```

### Environment Variables

**Backend** (`.env.development` or `.env.production`):
```env
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`.env.development` or `.env.production`):
```env
VITE_BACKEND_URL=http://localhost:5004
```

## Features Implemented

✅ **Real-time message delivery**
- Messages appear instantly for online users
- No page refresh needed

✅ **Online user tracking**
- See who's currently online
- Maintained in Redux store

✅ **Automatic reconnection**
- Socket reconnects if connection drops
- Handled by Socket.IO client

✅ **Message deduplication**
- Prevents duplicate messages in UI
- Checks message ID before adding

✅ **Auto-scroll**
- Scrolls to newest message
- Smooth animation

✅ **Image support**
- Send images in real-time
- Base64 encoding for upload

## Troubleshooting

### Messages not appearing in real-time

1. Check browser console for socket connection:
   ```
   Socket connected: <socket-id>
   ```

2. Check Redux DevTools:
   - `socket.isConnected` should be `true`
   - `socket.onlineUsers` should contain user IDs

3. Check backend logs:
   ```
   A user connected: <socket-id>
   User <userId> is online with socket <socket-id>
   ```

### User not appearing as online

- Ensure user is authenticated (has `userInfo` in Redux)
- Check `user-online` event is emitted after socket connection
- Verify `userInfo._id` exists

### CORS issues

Ensure backend CORS configuration includes:
```typescript
cors: {
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173'],
    credentials: true,
}
```

## Future Enhancements

- [ ] Typing indicators
- [ ] Read receipts
- [ ] Message reactions
- [ ] Voice/video calls
- [ ] Push notifications for offline users
- [ ] Message encryption
- [ ] Group chats

## Dependencies

**Backend**:
- `socket.io`: ^4.x

**Frontend**:
- `socket.io-client`: ^4.x

## Testing

To test real-time functionality:

1. Open app in two different browsers (or incognito)
2. Log in as different users in each
3. Navigate to messages
4. Send a message from User A
5. Message should appear instantly for User B

## Notes

- Socket connection is singleton (one per user session)
- Messages are persisted in MongoDB
- Real-time is only for delivery; history loaded from API
- Socket automatically cleans up on component unmount
