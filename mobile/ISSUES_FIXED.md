# Issues Fixed - December 6, 2025

## Issue 1: Profile Page Crash ✅ FIXED

### Problem
The app was crashing with error: "cannot refetch a query that has not been started yet" when viewing own profile and trying to refresh.

### Root Cause
The `useViewUserProfileQuery` was configured with `skip: true` when viewing own profile (to avoid unnecessary API calls since we have the data in Redux). However, the code was calling `refetch()` in multiple places without checking if the query was actually running:
1. In `useEffect` when switching profiles
2. In `onRefresh` callback
3. In `handleFollowToggle`

### Fix Applied
Updated three locations in `app/(tabs)/profile.tsx`:

1. **useEffect dependency fix** (line ~62):
   ```typescript
   // Before
   useEffect(() => {
       if (viewingUsername && profileUsername) {
           refetch();
       }
   }, [viewingUsername]);

   // After
   useEffect(() => {
       if (viewingUsername && profileUsername && !isOwnProfile) {
           refetch();
       }
   }, [viewingUsername, isOwnProfile, profileUsername]);
   ```

2. **onRefresh fix** (line ~233):
   ```typescript
   // Before
   const onRefresh = React.useCallback(() => {
       refetch();
   }, [refetch]);

   // After
   const onRefresh = React.useCallback(() => {
       if (!isOwnProfile) {
           refetch();
       }
       refetchPosts();
   }, [refetch, refetchPosts, isOwnProfile]);
   ```

3. **handleFollowToggle fix** (line ~85):
   ```typescript
   // Before
   Toast.show({ ... });
   refetch();

   // After
   Toast.show({ ... });
   if (!isOwnProfile) {
       refetch();
   }
   ```

### Result
✅ Profile page no longer crashes when viewing own profile
✅ Refresh works correctly for both own profile and other users' profiles
✅ Posts are always refetched on refresh

---

## Issue 2: Push Notifications Only Work When App is Open ⚠️ REQUIRES BACKEND IMPLEMENTATION

### Current Status
- ✅ Notifications work when app is in foreground (open)
- ❌ Notifications DO NOT work when app is in background
- ❌ Notifications DO NOT work when app is closed
- ❌ Notifications DO NOT work on lock screen

### Why This Happens
**Local notifications** (what's currently implemented) only work when the app is running. They are scheduled by the app itself when it receives a Socket.IO message.

When the app is closed or in background:
- Socket.IO connection is suspended
- No messages are received
- No local notifications can be scheduled

### What's Needed: Remote Push Notifications

For background notifications to work, you need **remote push notifications** sent from your backend through Expo's Push Notification Service. This is a completely different architecture:

#### Current Flow (Local Notifications - Foreground Only):
```
1. User sends message → Backend
2. Backend emits Socket.IO event
3. Mobile app receives event (IF APP IS RUNNING)
4. Mobile app schedules local notification
```

#### Required Flow (Remote Push Notifications - Works Always):
```
1. User sends message → Backend
2. Backend saves message to database
3. Backend looks up receiver's Expo Push Token
4. Backend sends push notification via Expo Push API
5. Expo Push Service delivers to device (EVEN IF APP IS CLOSED)
6. Device OS shows notification on lock screen
```

### What's Already Done (Mobile Side) ✅

1. **App Configuration** (`app.json`)
   - ✅ iOS `UIBackgroundModes`: `["remote-notification", "fetch"]`
   - ✅ Android permissions: `POST_NOTIFICATIONS`, `WAKE_LOCK`, `USE_FULL_SCREEN_INTENT`
   - ✅ expo-notifications plugin configured with production mode

2. **Notification Handler** (`app/_layout.tsx`)
   - ✅ Global notification handler set up at app root level
   - ✅ Push token registration on app startup
   - ✅ Push token saved to AsyncStorage

3. **Notification Utilities** (`lib/notifications.ts`)
   - ✅ Enhanced iOS permissions (alerts, badges, sounds, CarPlay, critical alerts)
   - ✅ Enhanced Android notification channel with lock screen visibility
   - ✅ High priority notifications
   - ✅ Function stub for saving push token to backend

### What's Still Needed (Backend Side) ⚠️

See `BACKGROUND_NOTIFICATIONS_SETUP.md` for complete implementation guide. Summary:

1. **Update User Model**
   - Add `expoPushToken: String` field to store device tokens

2. **Create Push Token Endpoint**
   - `POST /api/users/push-token` to save/update tokens

3. **Install Expo Server SDK**
   ```bash
   cd backend
   npm install expo-server-sdk
   ```

4. **Create Push Notification Service**
   - Service to send notifications via Expo Push API

5. **Update Message Handler**
   - When a message is received, look up receiver's push token
   - Send push notification via Expo Push Service

6. **Update Mobile App API**
   - Add mutation to send push token to backend
   - Call it after login and when token is obtained

### Testing Background Notifications

**After backend implementation:**

#### iOS:
1. Build with `npm run testflight`
2. Install TestFlight build on physical device
3. Completely close the app (swipe up in app switcher)
4. Lock the screen
5. Send a message from another account
6. Notification should appear on lock screen

#### Android:
1. Build with `eas build -p android`
2. Install on physical device
3. Completely close the app
4. Lock the screen
5. Send a message from another account
6. Notification should appear on lock screen

### Important Notes

- **Simulators/Emulators**: Push notifications don't work on iOS Simulator. Must use physical device.
- **Local vs Remote**: Local notifications are NOT the same as remote push notifications
- **Expo Push Service**: Free for up to 1 million notifications/month
- **Backend Required**: This cannot be fixed on mobile side alone - backend implementation is mandatory

### Next Steps

To enable background notifications:
1. ⏳ Implement backend changes (see `BACKGROUND_NOTIFICATIONS_SETUP.md`)
2. ⏳ Update mobile API slice to send push tokens
3. ⏳ Test on physical devices
4. ⏳ Monitor Expo push notification dashboard for delivery status

---

## Summary

| Issue | Status | Action Required |
|-------|--------|-----------------|
| Profile page crash | ✅ FIXED | None - resolved in this update |
| Background push notifications | ⚠️ REQUIRES BACKEND | Implement backend push notification service |

The profile page is now fully functional. For push notifications to work in background/lock screen, you must implement the backend portion as documented in `BACKGROUND_NOTIFICATIONS_SETUP.md`.
