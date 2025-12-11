import React, { useState } from 'react';
import SafeScreen from '@/components/layout/SafeScreen';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/hooks/useRedux';
import { clearCredentials } from '@/slices/authSlice';
import { useLogoutMutation } from '@/slices/usersApiSlice';
import SettingsProfileTab from '../../components/settings/SettingsProfileTab';
import SettingsPreferencesTab from '../../components/settings/SettingsPreferencesTab';
import Toast from 'react-native-toast-message';

const SettingsScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

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
            <SettingsProfileTab onLogout={handleLogout} />
          ) : (
            <SettingsPreferencesTab onDeleteAccount={handleDeleteAccount} />
          )}
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

// noinspection JSUnusedGlobalSymbols
export default SettingsScreen;
