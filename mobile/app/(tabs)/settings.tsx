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

const SettingsScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [logout] = useLogoutMutation();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');


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
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="light-content" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={['#6366f1', '#4f46e5', '#4338ca']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingHorizontal: 20, paddingBottom: 24 }}
        >
          <View style={{ paddingTop: insets.top + 16, paddingBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                overflow: 'hidden',
                marginRight: 14,
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.15)']}
                  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Ionicons name="settings" size={32} color="#fff" />
                </LinearGradient>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: '#fff',
                  letterSpacing: 0.5,
                }}>
                  Settings
                </Text>
                <Text style={{
                  fontSize: 15,
                  color: 'rgba(255, 255, 255, 0.95)',
                  marginTop: 4,
                  fontWeight: '500',
                }}>
                  Manage your profile and preferences
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Content Wrapper */}
        <View className="px-4 py-6">
          {/* Tabs */}
          <View className="flex-row mb-4">
            <TouchableOpacity
              onPress={() => setActiveTab('profile')}
              className={`flex-1 py-3 rounded-xl mr-2 ${activeTab === 'profile'
                ? 'bg-indigo-600'
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
                ? 'bg-indigo-600'
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
          {activeTab === 'profile' ? (
            <SettingsProfileTab onLogout={handleLogout} />
          ) : (
            <SettingsPreferencesTab onDeleteAccount={handleDeleteAccount} />
          )}

          {/* Bottom spacing for tab bar */}
          <View className="h-8" />
        </View>
      </ScrollView>
    </View>
  );
};

// noinspection JSUnusedGlobalSymbols
export default SettingsScreen;
