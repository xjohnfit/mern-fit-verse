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
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setCredentials } from '@/slices/authSlice';
import { useUpdateUserProfileMutation, usersApiSlice } from '@/slices/usersApiSlice';
import Slider from '@react-native-community/slider';
import UpdatePasswordModal from '@/components/settings/UpdatePasswordModal';
import SettingsPreferencesTabStyles from '@/styles/settings/SettingsPreferencesTabStyles';

interface SettingsPreferencesTabProps {
  onDeleteAccount: () => void;
}

const SettingsPreferencesTab: React.FC<SettingsPreferencesTabProps> = ({ onDeleteAccount }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = SettingsPreferencesTabStyles(isDark);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);
  const [updateUserProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [viewUserProfile] = usersApiSlice.endpoints.viewUserProfile.useLazyQuery();

  // Preferences state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [weightUnit, setWeightUnit] = useState<'lbs' | 'kg'>('lbs');
  const [restTimer, setRestTimer] = useState<number>(2); // in minutes
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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
      style={styles.settingItem}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      {rightComponent ||
        (showArrow && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDark ? '#9CA3AF' : '#6B7280'}
          />
        ))}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Workout Preferences */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Workout Preferences
        </Text>

        {/* Weight Unit */}
        <View style={styles.weightUnitCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="barbell" size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>
                Weight Unit
              </Text>
              <Text style={styles.cardSubtitle}>
                Choose your preferred weight measurement
              </Text>
            </View>
          </View>

          <View style={styles.unitButtonsContainer}>
            {(['lbs', 'kg'] as const).map((unit) => {
              const isSelected = weightUnit === unit;
              return (
                <TouchableOpacity
                  key={unit}
                  onPress={() => handleWeightUnitChange(unit)}
                  disabled={isUpdatingProfile}
                  style={isSelected ? styles.unitButtonActive : styles.unitButton}
                  activeOpacity={0.7}
                >
                  <View style={styles.unitButtonContent}>
                    <Text
                      style={isSelected ? styles.unitButtonTextActive : styles.unitButtonText}
                    >
                      {unit.toUpperCase()}
                    </Text>
                    <Text
                      style={isSelected ? styles.unitButtonSubtextActive : styles.unitButtonSubtext}
                    >
                      {unit === 'lbs' ? 'Pounds' : 'Kilograms'}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkmarkContainer}>
                      <View style={styles.checkmarkCircle}>
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
        <View style={styles.weightUnitCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainerPurple}>
              <Ionicons name="timer" size={20} color={isDark ? '#C084FC' : '#A855F7'} />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>
                Rest Timer
              </Text>
              <Text style={styles.cardSubtitle}>
                Default rest time between sets
              </Text>
            </View>
          </View>

          <View style={styles.restTimerContent}>
            <View style={styles.restTimerRow}>
              <Text style={styles.restTimerLabel}>
                Duration:
              </Text>
              <Text style={styles.restTimerValue}>
                {restTimer} min{restTimer !== 1 ? 's' : ''}
              </Text>
            </View>

            <Slider
              style={styles.sliderContainer}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={restTimer}
              onValueChange={(value: number) => handleRestTimerChange(value)}
              onSlidingComplete={(value: number) => handleRestTimerComplete(value)}
              minimumTrackTintColor={isDark ? '#C084FC' : '#A855F7'}
              maximumTrackTintColor={isDark ? '#374151' : '#E5E7EB'}
              thumbTintColor={isDark ? '#C084FC' : '#A855F7'}
            />

            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>1 min</Text>
              <Text style={styles.sliderLabelText}>5 mins</Text>
              <Text style={styles.sliderLabelText}>10 mins</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Appearance */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
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
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
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
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Privacy & Security
        </Text>

        <SettingItem
          icon="lock-closed"
          title="Change Password"
          subtitle="Update your password"
          onPress={() => setShowPasswordModal(true)}
        />

        <SettingItem
          icon="shield-checkmark"
          title="Privacy Policy"
          subtitle="View our privacy policy"
          onPress={() => router.push('/settings/privacyPolicy')}
        />

        <SettingItem
          icon="document-text"
          title="Terms of Service"
          subtitle="View terms and conditions"
          onPress={() => router.push('/settings/TermsOfService')}
        />
      </View>

      {/* Data Management */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
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
            Toast.show({
              type: 'info',
              text1: 'Clear Cache',
              text2: 'This feature is coming soon',
            });
          }}
        />
      </View>

      {/* About */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
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
          subtitle="Send us a message"
          onPress={() => router.push('/settings/helpAndSupport')}
        />
      </View>

      {/* Danger Zone */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitleDanger}>
          Danger Zone
        </Text>

        <TouchableOpacity
          onPress={onDeleteAccount}
          style={styles.dangerButton}
          activeOpacity={0.7}
        >
          <View style={styles.dangerIconContainer}>
            <Ionicons name="trash" size={20} color="#DC2626" />
          </View>
          <View style={styles.dangerTextContainer}>
            <Text style={styles.dangerTitle}>
              Delete Account
            </Text>
            <Text style={styles.dangerSubtitle}>
              Permanently delete your account
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#DC2626"
          />
        </TouchableOpacity>
      </View>

      {/* Update Password Modal */}
      <UpdatePasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </View>
  );
};

export default SettingsPreferencesTab;

