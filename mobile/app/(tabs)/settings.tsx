import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '@/hooks/useRedux';
import { clearCredentials } from '@/slices/authSlice';
import { useLogoutMutation } from '@/slices/usersApiSlice';
import SettingsProfileTab from '../../components/settings/SettingsProfileTab';
import SettingsPreferencesTab from '../../components/settings/SettingsPreferencesTab';
import settingsStyles from '../../styles/settings/settingsStyles';

const SettingsScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [logout] = useLogoutMutation();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');
  const styles = settingsStyles(isDark);


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
    router.push('/settings/deleteAcount');
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={['#6366f1', '#4f46e5', '#4338ca']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerContainer}
        >
          <View style={[styles.headerInner, { paddingTop: insets.top + 16 }]}>
            <View style={styles.headerContent}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.15)']}
                  style={styles.iconGradient}
                >
                  <Ionicons name="settings" size={32} color="#fff" />
                </LinearGradient>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>
                  Settings
                </Text>
                <Text style={styles.subtitle}>
                  Manage your profile and preferences
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Content Wrapper */}
        <View style={styles.contentWrapper}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              onPress={() => setActiveTab('profile')}
              style={activeTab === 'profile' ? styles.tabButtonActive : styles.tabButton}
            >
              <Text
                style={activeTab === 'profile' ? styles.tabTextActive : styles.tabText}
              >
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('preferences')}
              style={activeTab === 'preferences' ? styles.tabButtonLastActive : styles.tabButtonLast}
            >
              <Text
                style={activeTab === 'preferences' ? styles.tabTextActive : styles.tabText}
              >
                Preferences
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'profile' ? (
            <SettingsProfileTab onLogout={handleLogout} />
          ) : (
            <SettingsPreferencesTab onDeleteAccount={handleDeleteAccount} />
          )}

          {/* Bottom spacing for tab bar */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </View>
  );
};

// noinspection JSUnusedGlobalSymbols
export default SettingsScreen;
