# Background Push Notifications Setup Guide

## Current Status
✅ **Foreground notifications**: Working (when app is open)  
⚠️ **Background notifications**: Requires backend implementation

## What's Been Done (Mobile App)

### 1. App Configuration (`app.json`)
- ✅ Added `UIBackgroundModes` for iOS: `["remote-notification", "fetch"]`
- ✅ Configured `expo-notifications` plugin with production mode
- ✅ Added Android permissions:
  - `POST_NOTIFICATIONS`
  - `WAKE_LOCK`
  - `USE_FULL_SCREEN_INTENT`
  - `RECEIVE_BOOT_COMPLETED`
  - `VIBRATE`

### 2. Notification Handler (`app/_layout.tsx`)
- ✅ Set up global notification handler at app root level
- ✅ Configured to show alerts, play sounds, and set badges
- ✅ Request permissions on app startup
- ✅ Save push token to AsyncStorage

### 3. Notification Utilities (`lib/notifications.ts`)
- ✅ Enhanced iOS permission requests (alerts, badges, sounds, CarPlay, critical alerts)
- ✅ Enhanced Android notification channel with lock screen visibility
- ✅ Added high priority for Android notifications
- ✅ Added function stub for saving push token to backend

## What Still Needs to Be Done

### Backend Implementation Required

To enable **true background notifications**, you need to implement server-side push notifications using the Expo Push Notification service.

#### Step 1: Update User Model
Add `expoPushToken` field to store the user's device push token:

```typescript
// backend/models/userModel.ts
const userSchema = new Schema<IUser>({
    // ... existing fields
    expoPushToken: { type: String, default: null },
});
```

#### Step 2: Create Push Token Endpoint
Add an endpoint to save/update the user's push token:

```typescript
// backend/controllers/userController.ts
export const updatePushToken = asyncHandler(
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const { pushToken } = req.body;
        
        const user = await User.findById(req.user!._id);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        
        user.expoPushToken = pushToken;
        await user.save();
        
        res.status(200).json({ message: 'Push token updated' });
    }
);

// backend/routes/userRoutes.ts
router.post('/push-token', protect, updatePushToken);
```

#### Step 3: Install Expo Server SDK
Install the Expo push notification SDK in your backend:

```bash
cd backend
npm install expo-server-sdk
```

#### Step 4: Create Push Notification Service
Create a service to send push notifications via Expo:

```typescript
// backend/utils/pushNotifications.ts
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

export async function sendPushNotification(
    pushToken: string,
    title: string,
    body: string,
    data?: any
) {
    if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return;
    }

    const message: ExpoPushMessage = {
        to: pushToken,
        sound: 'default',
        title,
        body,
        data,
        priority: 'high',
        channelId: 'default',
    };

    try {
        const ticket = await expo.sendPushNotificationsAsync([message]);
        console.log('Push notification sent:', ticket);
        return ticket;
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
}
```

#### Step 5: Send Notifications When Messages Arrive
Update your message controller to send push notifications:

```typescript
// backend/controllers/messageController.ts
import { sendPushNotification } from '../utils/pushNotifications';

// In your sendMessage or socket message handler:
socket.on('send-message', async (data) => {
    // ... existing message logic
    
    // Get receiver's push token
    const receiver = await User.findById(data.receiverId);
    
    if (receiver?.expoPushToken) {
        await sendPushNotification(
            receiver.expoPushToken,
            sender.name,
            data.text,
            { senderId: data.senderId, type: 'message' }
        );
    }
    
    // ... emit to socket as before
});
```

#### Step 6: Update Mobile App to Send Token
Update the notifications API slice to send the token to backend:

```typescript
// mobile/slices/usersApiSlice.ts
updatePushToken: builder.mutation({
    query: (pushToken) => ({
        url: '/users/push-token',
        method: 'POST',
        body: { pushToken },
    }),
}),
```

Then call it after login and when token is obtained:

```typescript
// mobile/app/_layout.tsx or after login
import { useUpdatePushTokenMutation } from '../slices/usersApiSlice';

const [updatePushToken] = useUpdatePushTokenMutation();

useEffect(() => {
    const registerToken = async () => {
        const token = await registerForPushNotificationsAsync();
        if (token && userInfo?._id) {
            await updatePushToken(token);
        }
    };
    registerToken();
}, [userInfo]);
```

## Testing Background Notifications

### iOS Testing
1. Build app with `npm run testflight` 
2. Install TestFlight build on physical device
3. Close the app completely (swipe up from app switcher)
4. Send a message from another account
5. Notification should appear on lock screen

### Android Testing
1. Build app with `eas build -p android`
2. Install APK on physical device
3. Close the app completely
4. Send a message from another account
5. Notification should appear

## Important Notes

1. **Local notifications** (current setup) only work when app is running in foreground or background
2. **Remote push notifications** (via Expo) work even when app is completely closed
3. iOS requires physical device for testing push notifications
4. Make sure your Expo project ID is correctly set in `app.json`
5. Ensure your EAS project has push notification credentials configured

## Troubleshooting

### Notifications not showing on iOS
- Check Settings > Notifications > FitVerse - ensure notifications are enabled
- Verify `UIBackgroundModes` is in `Info.plist`
- Make sure using physical device (not simulator)
- Check that push token is being sent to backend

### Notifications not showing on Android
- Check app notification settings are enabled
- Verify notification channel is created with MAX importance
- Ensure `POST_NOTIFICATIONS` permission is granted (Android 13+)

### Push tokens not working
- Verify Expo project ID in `app.json` matches your EAS project
- Check that expo-server-sdk is installed on backend
- Verify push token format is valid (starts with `ExponentPushToken[`)
- Check backend logs for push notification errors

## Next Steps

1. ✅ Mobile app configuration - DONE
2. ⏳ Add `expoPushToken` to user model - TODO
3. ⏳ Create backend endpoint to save push tokens - TODO
4. ⏳ Install `expo-server-sdk` on backend - TODO
5. ⏳ Implement push notification service - TODO
6. ⏳ Update message handler to send push notifications - TODO
7. ⏳ Update mobile app to send token to backend - TODO
8. ⏳ Test on physical devices - TODO
