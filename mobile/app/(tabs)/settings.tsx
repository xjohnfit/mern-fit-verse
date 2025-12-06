import React, { useState, useEffect } from 'react';
import SafeScreen from '@/components/layout/SafeScreen';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Switch,
  useColorScheme,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { clearCredentials, setCredentials } from '../../slices/authSlice';
import { useLogoutMutation, useUpdateUserProfileMutation } from '../../slices/usersApiSlice';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

const SettingsScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const { userInfo } = useAppSelector((state) => state.auth);

  const [logout] = useLogoutMutation();
  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  // Profile state - separate useState for each field to avoid re-render issues
  const [name, setName] = useState(userInfo?.name || '');
  const [username, setUsername] = useState(userInfo?.username || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [dob, setDob] = useState(userInfo?.dob ? new Date(userInfo.dob).toISOString().split('T')[0] : '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [height, setHeight] = useState(userInfo?.height ? String(userInfo.height) : '');
  const [weight, setWeight] = useState(userInfo?.weight ? String(userInfo.weight) : '');
  const [gender, setGender] = useState(userInfo?.gender || '');
  const [goal, setGoal] = useState(userInfo?.goal || '');
  const [photoUri, setPhotoUri] = useState<string | null>(userInfo?.photo || null);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');

  // Preferences state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(colorScheme === 'dark');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  // Sync state with userInfo when it changes
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setUsername(userInfo.username || '');
      setEmail(userInfo.email || '');
      setDob(userInfo.dob ? new Date(userInfo.dob).toISOString().split('T')[0] : '');
      setHeight(userInfo.height ? String(userInfo.height) : '');
      setWeight(userInfo.weight ? String(userInfo.weight) : '');
      setGender(userInfo.gender || '');
      setGoal(userInfo.goal || '');
      setPhotoUri(userInfo.photo || null);
    }
  }, [userInfo]);

  const loadPreferences = async () => {
    try {
      const notifications = await AsyncStorage.getItem('notifications_enabled');
      const motion = await AsyncStorage.getItem('reduced_motion');

      if (notifications !== null) setNotificationsEnabled(JSON.parse(notifications));
      if (motion !== null) setReducedMotion(JSON.parse(motion));
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreference = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving preference:', error);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      // Format date in local timezone to avoid timezone offset issues
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setDob(`${year}-${month}-${day}`);
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  };

  const parseDateForPicker = (dateString: string) => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split('-');
    // Create date in local timezone
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick image',
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (!name || !username) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: 'Name and username are required',
        });
        return;
      }

      const updateData: any = {};

      // Only include fields that have changed
      if (name !== userInfo?.name) updateData.name = name;
      if (username !== userInfo?.username) updateData.username = username;
      if (email !== userInfo?.email) updateData.email = email;
      if (dob !== (userInfo?.dob ? new Date(userInfo.dob).toISOString().split('T')[0] : '')) updateData.dob = dob;
      if (height !== String(userInfo?.height || '')) updateData.height = height;
      if (weight !== String(userInfo?.weight || '')) updateData.weight = weight;
      if (gender !== userInfo?.gender) updateData.gender = gender;
      if (goal !== userInfo?.goal) updateData.goal = goal;

      if (photoUri && photoUri !== userInfo?.photo) {
        updateData.photo = photoUri;
      }

      const result = await updateUserProfile(updateData).unwrap();
      dispatch(setCredentials(result));

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully!',
      });
    } catch (error: any) {
      console.error('Update failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error?.data?.message || 'Failed to update profile',
      });
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout().unwrap();
            dispatch(clearCredentials());
            router.replace('/login');
          } catch (error) {
            console.error('Logout failed:', error);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is permanent and cannot be undone. All your data will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Toast.show({
              type: 'info',
              text1: 'Feature Coming Soon',
              text2: 'Account deletion will be available in a future update',
            });
          },
        },
      ]
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightComponent,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center px-4 py-4 bg-white dark:bg-gray-800 rounded-xl mb-3 shadow-sm"
      activeOpacity={0.7}
    >
      <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mr-4">
        <Ionicons name={icon} size={20} color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</Text>
        )}
      </View>
      {rightComponent ||
        (showArrow && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
        ))}
    </TouchableOpacity>
  );

  return (
    <SafeScreen>
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 pt-2 pb-4">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</Text>
          <Text className="text-base text-gray-600 dark:text-gray-400">
            Manage your profile and preferences
          </Text>
        </View>

        {/* Tabs */}
        <View className="flex-row px-4 mb-4">
          <TouchableOpacity
            onPress={() => setActiveTab('profile')}
            className={`flex-1 py-3 rounded-xl mr-2 ${activeTab === 'profile'
              ? 'bg-blue-600'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
          >
            <Text
              className={`text-center font-semibold ${activeTab === 'profile' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}
            >
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('preferences')}
            className={`flex-1 py-3 rounded-xl ${activeTab === 'preferences'
              ? 'bg-blue-600'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
          >
            <Text
              className={`text-center font-semibold ${activeTab === 'preferences' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}
            >
              Preferences
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeTab === 'profile' ? (
            <View className="pb-6">
              {/* Profile Photo */}
              <View className="items-center mb-8 mt-2">
                <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
                  <View className="relative">
                    {photoUri ? (
                      <Image
                        source={{ uri: photoUri }}
                        className="w-36 h-36 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
                      />
                    ) : (
                      <View className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg">
                        <Ionicons
                          name="person"
                          size={70}
                          color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                        />
                      </View>
                    )}
                    <View className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 items-center justify-center border-4 border-white dark:border-gray-900 shadow-lg">
                      <Ionicons name="camera" size={22} color="white" />
                    </View>
                  </View>
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900 dark:text-white mt-5">
                  {userInfo?.name || 'Your Name'}
                </Text>
                <Text className="text-base text-gray-500 dark:text-gray-400 mt-1">
                  @{userInfo?.username || 'username'}
                </Text>
              </View>

              {/* Basic Info */}
              <View className="mb-8">
                <View className="flex-row items-center mb-5">
                  <View className="w-1 h-6 bg-blue-600 rounded-full mr-3" />
                  <Text className="text-xl font-bold text-gray-900 dark:text-white">
                    Basic Information
                  </Text>
                </View>

                <View className="mb-5">
                  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                    Full Name
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
                      borderRadius: 16,
                      fontSize: 16,
                      color: colorScheme === 'dark' ? '#FFFFFF' : '#111827',
                      borderWidth: 2,
                      borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
                    }}
                  />
                </View>

                <View className="mb-5">
                  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                    Username
                  </Text>
                  <TextInput
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                    }}
                    placeholder="Enter your username"
                    placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
                      borderRadius: 16,
                      fontSize: 16,
                      color: colorScheme === 'dark' ? '#FFFFFF' : '#111827',
                      borderWidth: 2,
                      borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
                    }}
                  />
                </View>

                <View className="mb-5">
                  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                    Email
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                    keyboardType="email-address"
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
                      borderRadius: 16,
                      fontSize: 16,
                      color: colorScheme === 'dark' ? '#FFFFFF' : '#111827',
                      borderWidth: 2,
                      borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
                    }}
                  />
                </View>

                <View>
                  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                    Date of Birth
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
                        borderRadius: 16,
                        borderWidth: 2,
                        borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: dob
                            ? colorScheme === 'dark'
                              ? '#FFFFFF'
                              : '#111827'
                            : colorScheme === 'dark'
                              ? '#6B7280'
                              : '#9CA3AF',
                        }}
                      >
                        {dob ? formatDateForDisplay(dob) : 'Select date of birth'}
                      </Text>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
                      />
                    </View>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={dob ? parseDateForPicker(dob) : new Date()}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </View>
              </View>

              {/* Physical Info */}
              <View className="mb-8">
                <View className="flex-row items-center mb-5">
                  <View className="w-1 h-6 bg-purple-600 rounded-full mr-3" />
                  <Text className="text-xl font-bold text-gray-900 dark:text-white">
                    Physical Information
                  </Text>
                </View>

                <View className="flex-row gap-4 mb-5">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                      Height (cm)
                    </Text>
                    <TextInput
                      value={height}
                      onChangeText={setHeight}
                      placeholder="0"
                      placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                      keyboardType="numeric"
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
                        borderRadius: 16,
                        fontSize: 16,
                        color: colorScheme === 'dark' ? '#FFFFFF' : '#111827',
                        borderWidth: 2,
                        borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
                      }}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                      Weight (lbs)
                    </Text>
                    <TextInput
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="0"
                      placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                      keyboardType="numeric"
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
                        borderRadius: 16,
                        fontSize: 16,
                        color: colorScheme === 'dark' ? '#FFFFFF' : '#111827',
                        borderWidth: 2,
                        borderColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
                      }}
                    />
                  </View>
                </View>

                <View className="mb-5">
                  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                    Gender
                  </Text>
                  <View className="flex-row gap-3">
                    {['male', 'female', 'other'].map((g) => (
                      <TouchableOpacity
                        key={g}
                        onPress={() => setGender(g)}
                        className={`flex-1 px-4 py-4 rounded-2xl border-2 ${gender === g
                          ? 'bg-blue-600 border-blue-600'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          }`}
                        activeOpacity={0.7}
                      >
                        <Text
                          className={`text-center font-semibold text-base capitalize ${gender === g ? 'text-white' : 'text-gray-900 dark:text-white'
                            }`}
                        >
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5">
                    Fitness Goal
                  </Text>
                  {[
                    { value: 'lose-weight', label: 'Lose Weight', icon: 'trending-down' },
                    { value: 'build-muscle', label: 'Build Muscle', icon: 'fitness' },
                    { value: 'maintain', label: 'Maintain Health', icon: 'heart' },
                  ].map((g, index) => (
                    <TouchableOpacity
                      key={g.value}
                      onPress={() => setGoal(g.value)}
                      className={`flex-row items-center px-5 py-4 rounded-2xl border-2 ${index > 0 ? 'mt-3' : ''
                        } ${goal === g.value
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        }`}
                      activeOpacity={0.7}
                    >
                      <View
                        className={`w-10 h-10 rounded-full items-center justify-center ${goal === g.value ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-700'
                          }`}
                      >
                        <Ionicons
                          name={g.icon as any}
                          size={20}
                          color={
                            goal === g.value
                              ? '#FFFFFF'
                              : colorScheme === 'dark'
                                ? '#9CA3AF'
                                : '#6B7280'
                          }
                        />
                      </View>
                      <Text
                        className={`ml-4 font-semibold text-base flex-1 ${goal === g.value
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-900 dark:text-white'
                          }`}
                      >
                        {g.label}
                      </Text>
                      {goal === g.value && (
                        <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Update Button */}
              <TouchableOpacity
                onPress={handleUpdateProfile}
                disabled={isUpdating}
                activeOpacity={0.8}
                className="mb-6"
              >
                <LinearGradient
                  colors={['#3B82F6', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 18,
                    paddingHorizontal: 24,
                    borderRadius: 16,
                    shadowColor: '#3B82F6',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <View className="flex-row items-center justify-center">
                    {isUpdating ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Ionicons name="save" size={22} color="white" />
                        <Text className="text-white font-bold text-lg ml-3">Update Profile</Text>
                      </>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Logout Button */}
              <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center justify-center bg-red-600 px-6 py-4 rounded-xl"
                activeOpacity={0.8}
              >
                <Ionicons name="log-out" size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="pb-6">
              {/* Appearance */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">
                  Appearance
                </Text>

                <SettingItem
                  icon="moon"
                  title="Dark Mode"
                  subtitle={`Currently ${darkModeEnabled ? 'enabled' : 'disabled'}`}
                  showArrow={false}
                  rightComponent={
                    <Switch
                      value={darkModeEnabled}
                      onValueChange={(value) => {
                        setDarkModeEnabled(value);
                        Toast.show({
                          type: 'info',
                          text1: 'Theme Change',
                          text2: 'Restart the app to apply changes',
                        });
                      }}
                    />
                  }
                />

                <SettingItem
                  icon="eye-off"
                  title="Reduced Motion"
                  subtitle="Minimize animations"
                  showArrow={false}
                  rightComponent={
                    <Switch
                      value={reducedMotion}
                      onValueChange={(value) => {
                        setReducedMotion(value);
                        savePreference('reduced_motion', value);
                        Toast.show({
                          type: 'success',
                          text1: reducedMotion ? 'Animations enabled' : 'Animations disabled',
                        });
                      }}
                    />
                  }
                />
              </View>

              {/* Notifications */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">
                  Notifications
                </Text>

                <SettingItem
                  icon="notifications"
                  title="Push Notifications"
                  subtitle={`${notificationsEnabled ? 'Enabled' : 'Disabled'}`}
                  showArrow={false}
                  rightComponent={
                    <Switch
                      value={notificationsEnabled}
                      onValueChange={(value) => {
                        setNotificationsEnabled(value);
                        savePreference('notifications_enabled', value);
                        Toast.show({
                          type: 'success',
                          text1: value ? 'Notifications enabled' : 'Notifications disabled',
                        });
                      }}
                    />
                  }
                />
              </View>

              {/* Privacy & Security */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">
                  Privacy & Security
                </Text>

                <SettingItem
                  icon="lock-closed"
                  title="Change Password"
                  subtitle="Update your password"
                  onPress={() => {
                    Toast.show({
                      type: 'info',
                      text1: 'Coming Soon',
                      text2: 'Password change will be available soon',
                    });
                  }}
                />

                <SettingItem
                  icon="shield-checkmark"
                  title="Privacy Policy"
                  subtitle="View our privacy policy"
                  onPress={() => {
                    Toast.show({
                      type: 'info',
                      text1: 'Privacy Policy',
                      text2: 'Opening privacy policy...',
                    });
                  }}
                />

                <SettingItem
                  icon="document-text"
                  title="Terms of Service"
                  subtitle="View terms and conditions"
                  onPress={() => {
                    Toast.show({
                      type: 'info',
                      text1: 'Terms of Service',
                      text2: 'Opening terms...',
                    });
                  }}
                />
              </View>

              {/* Data Management */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">
                  Data Management
                </Text>

                <SettingItem
                  icon="download"
                  title="Export Data"
                  subtitle="Download your fitness data"
                  onPress={() => {
                    Toast.show({
                      type: 'info',
                      text1: 'Export Data',
                      text2: 'This feature is coming soon',
                    });
                  }}
                />

                <SettingItem
                  icon="refresh"
                  title="Clear Cache"
                  subtitle="Free up storage space"
                  onPress={() => {
                    Alert.alert('Clear Cache', 'Are you sure you want to clear the cache?', [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Clear',
                        onPress: () => {
                          Toast.show({
                            type: 'success',
                            text1: 'Cache Cleared',
                            text2: 'App cache has been cleared',
                          });
                        },
                      },
                    ]);
                  }}
                />
              </View>

              {/* About */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">
                  About
                </Text>

                <SettingItem
                  icon="information-circle"
                  title="App Version"
                  subtitle="1.0.0"
                  showArrow={false}
                />

                <SettingItem
                  icon="help-circle"
                  title="Help & Support"
                  subtitle="Get help with the app"
                  onPress={() => {
                    Toast.show({
                      type: 'info',
                      text1: 'Help & Support',
                      text2: 'Contact support@fitverse.com',
                    });
                  }}
                />
              </View>

              {/* Danger Zone */}
              <View className="mb-6">
                <Text className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 px-1">
                  Danger Zone
                </Text>

                <TouchableOpacity
                  onPress={handleDeleteAccount}
                  className="flex-row items-center px-4 py-4 bg-red-50 dark:bg-red-900/20 rounded-xl mb-3 border border-red-200 dark:border-red-800"
                  activeOpacity={0.7}
                >
                  <View className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mr-4">
                    <Ionicons name="trash" size={20} color="#DC2626" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-red-600 dark:text-red-400">
                      Delete Account
                    </Text>
                    <Text className="text-sm text-red-500 dark:text-red-400/80 mt-1">
                      Permanently delete your account
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

export default SettingsScreen;
