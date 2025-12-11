import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Switch,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setCredentials } from '@/slices/authSlice';
import { useUpdateUserProfileMutation } from '@/slices/usersApiSlice';
import Slider from '@react-native-community/slider';

interface SettingsPreferencesTabProps {
  onDeleteAccount: () => void;
}

const SettingsPreferencesTab: React.FC<SettingsPreferencesTabProps> = ({ onDeleteAccount }) => {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);
  const [updateUserProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();

  // Preferences state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [restTimer, setRestTimer] = useState<number>(2); // in minutes

  // Ref to track when we're updating to prevent useEffect from overwriting
  const isUpdatingRestTimer = useRef(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  // Update preferences when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setWeightUnit(userInfo.weightUnit || 'lbs');
      // Convert seconds to minutes for display (default 120 seconds = 2 minutes)
      const restTimerInMinutes = userInfo.restTimer ? Math.round(userInfo.restTimer / 60) : 2;

      // Only update if the value is different from the current state
      setRestTimer(prev => {
        if (prev !== restTimerInMinutes && !isUpdatingRestTimer.current) {
          return restTimerInMinutes;
        }
        return prev;
      });
    }
  }, [userInfo]);

  const loadPreferences = async () => {
    try {
      const notifications = await AsyncStorage.getItem('notifications_enabled');
      const motion = await AsyncStorage.getItem('reduced_motion');

      if (notifications !== null) setNotificationsEnabled(JSON.parse(notifications));
      if (motion !== null) setReducedMotion(JSON.parse(motion));

      // Load from userInfo
      if (userInfo) {
        setWeightUnit(userInfo.weightUnit || 'lbs');
        // Convert seconds to minutes for display (default 120 seconds = 2 minutes)
        const restTimerInMinutes = userInfo.restTimer ? Math.round(userInfo.restTimer / 60) : 2;
        setRestTimer(restTimerInMinutes);
      }
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

  const handleWeightUnitChange = async (newUnit: 'lbs' | 'kg') => {
    try {
      const res = await updateUserProfile({ weightUnit: newUnit }).unwrap();
      dispatch(setCredentials(res));
      setWeightUnit(newUnit);
      Toast.show({
        type: 'success',
        text1: 'Weight Unit Updated',
        text2: `Changed to ${newUnit.toUpperCase()}`,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error?.data?.message || 'Failed to update weight unit',
      });
    }
  };

  const handleRestTimerChange = (minutes: number) => {
    // Update state immediately for real-time display
    setRestTimer(minutes);
  };

  const handleRestTimerComplete = async (minutes: number) => {
    try {
      // Set flag to prevent useEffect from overwriting
      isUpdatingRestTimer.current = true;

      // Convert minutes to seconds for backend storage
      const seconds = Math.round(minutes * 60);

      // Validate the value
      if (seconds < 60 || seconds > 600) {
        console.error('Invalid rest timer value:', seconds);
        isUpdatingRestTimer.current = false;
        return;
      }

      const payload = { restTimer: seconds };
      const res = await updateUserProfile(payload).unwrap();
      dispatch(setCredentials(res));

      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Rest Timer Updated',
        text2: `Set to ${minutes} minute${minutes !== 1 ? 's' : ''}`,
      });

      // Reset flag after a delay to ensure all useEffects have run
      setTimeout(() => {
        isUpdatingRestTimer.current = false;
      }, 100);
    } catch (error: any) {
      isUpdatingRestTimer.current = false;
      console.error('Failed to update rest timer:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error?.data?.message || 'Failed to update rest timer',
      });
    }
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
    <View className="pb-6">

      {/* Workout Preferences */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">
          Workout Preferences
        </Text>

        {/* Weight Unit */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-5 mb-3 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mr-3">
              <Ionicons name="barbell" size={20} color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                Weight Unit
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Choose your preferred weight measurement
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            {(['lbs', 'kg'] as const).map((unit) => {
              const isSelected = weightUnit === unit;
              return (
                <TouchableOpacity
                  key={unit}
                  onPress={() => handleWeightUnitChange(unit)}
                  disabled={isUpdatingProfile}
                  className={`flex-1 px-4 py-4 rounded-2xl border-2 ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="items-center">
                    <Text
                      className={`text-2xl font-bold mb-1 ${
                        isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {unit.toUpperCase()}
                    </Text>
                    <Text
                      className={`text-xs ${
                        isSelected
                          ? 'text-blue-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {unit === 'lbs' ? 'Pounds' : 'Kilograms'}
                    </Text>
                  </View>
                  {isSelected && (
                    <View className="absolute top-2 right-2">
                      <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
                        <Ionicons name="checkmark" size={16} color="#3B82F6" />
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Rest Timer */}
        <View className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center mr-3">
              <Ionicons name="timer" size={20} color={colorScheme === 'dark' ? '#C084FC' : '#A855F7'} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                Rest Timer
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Default rest time between sets
              </Text>
            </View>
          </View>

          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration:
              </Text>
              <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {restTimer} min{restTimer !== 1 ? 's' : ''}
              </Text>
            </View>

            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={restTimer}
              onValueChange={(value: number) => handleRestTimerChange(value)}
              onSlidingComplete={(value: number) => handleRestTimerComplete(value)}
              minimumTrackTintColor={colorScheme === 'dark' ? '#C084FC' : '#A855F7'}
              maximumTrackTintColor={colorScheme === 'dark' ? '#374151' : '#E5E7EB'}
              thumbTintColor={colorScheme === 'dark' ? '#C084FC' : '#A855F7'}
            />

            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-500 dark:text-gray-400">1 min</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">5 mins</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">10 mins</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Appearance */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">
          Appearance
        </Text>

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
                  text1: value ? 'Animations disabled' : 'Animations enabled',
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
          onPress={onDeleteAccount}
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
  );
};

export default SettingsPreferencesTab;

