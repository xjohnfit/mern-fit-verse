# Redux RTK Setup for Mobile App

This mobile app now uses Redux Toolkit (RTK) for state management, matching the frontend implementation.

## Structure

### Store Configuration
- **`store.ts`**: Main Redux store configuration with all reducers and middleware

### Slices

#### State Slices
- **`authSlice.ts`**: Authentication state management (uses AsyncStorage instead of localStorage)
- **`socketSlice.ts`**: Socket.IO connection state and online users

#### API Slices (RTK Query)
- **`apiSlice.ts`**: Base API configuration for main backend endpoints
- **`fatSecretApiSlice.ts`**: Separate API for FatSecret nutrition data
- **`usersApiSlice.ts`**: User authentication and profile endpoints
- **`workoutApiSlice.ts`**: Workout CRUD operations
- **`nutritionApiSlice.ts`**: Nutrition tracking endpoints
- **`postsApiSlice.ts`**: Social feed and post management
- **`exerciseApiSlice.ts`**: Exercise library endpoints
- **`customCategoryApiSlice.ts`**: Custom meal categories
- **`workoutTemplateApiSlice.ts`**: Workout template management
- **`workoutTemplateFolderApiSlice.ts`**: Template folder organization
- **`notificationApiSlice.ts`**: User notifications
- **`messageApiSlice.ts`**: Direct messaging

## Usage

### Using Hooks

```typescript
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';

// In your component
const dispatch = useAppDispatch();
const userInfo = useAppSelector((state) => state.auth.userInfo);
```

### RTK Query Hooks

```typescript
import { useGetUserProfileQuery, useLoginMutation } from '../slices/usersApiSlice';

// In your component
const { data: profile, isLoading, error } = useGetUserProfileQuery();
const [login, { isLoading: isLoggingIn }] = useLoginMutation();
```

## Environment Configuration

The app uses `Constants.expoConfig?.extra?.mode` to determine the environment:
- **Development**: `http://localhost:5004/api`
- **Production**: `https://api.fitverse.codewithxjohn.com/api`

Configure in `app.json`:
```json
{
  "expo": {
    "extra": {
      "mode": "development"
    }
  }
}
```

## Key Differences from Frontend

1. **Storage**: Uses `AsyncStorage` instead of `localStorage` for persistence
2. **Environment Variables**: Uses Expo's `Constants.expoConfig.extra` instead of Vite's `import.meta.env`
3. **Auth Restoration**: Added `restoreCredentials` action for app initialization

## TypeScript Support

Full TypeScript support with typed hooks and API responses:
- `RootState` - Type for the entire Redux state
- `AppDispatch` - Type for the dispatch function
- All API endpoints have typed request/response interfaces
