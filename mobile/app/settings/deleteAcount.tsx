import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useDeleteUserMutation } from '@/slices/usersApiSlice';
import { useAppDispatch } from '@/hooks/useRedux';
import { clearCredentials } from '@/slices/authSlice';
import Toast from 'react-native-toast-message';
import deleteAccountStyles from '@/styles/settings/deleteAccountScreenStyles';

const DeleteAccountScreen = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const [confirmText, setConfirmText] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      Toast.show({
        type: 'error',
        text1: 'Confirmation Required',
        text2: 'Please type DELETE to confirm',
      });
      return;
    }

    Alert.alert(
      'Final Confirmation',
      'This action cannot be undone. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser().unwrap();
              dispatch(clearCredentials());
              Toast.show({
                type: 'success',
                text1: 'Account Deleted',
                text2: 'Your account has been permanently deleted',
              });
              router.replace('/login');
            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Delete Failed',
                text2: error?.data?.message || 'Failed to delete account',
              });
            }
          },
        },
      ]
    );
  };

  const isDeleteDisabled = isLoading || confirmText !== 'DELETE';

  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      <View style={[
        deleteAccountStyles.container,
        isDark ? deleteAccountStyles.darkBackground : deleteAccountStyles.lightBackground
      ]}>
        {/* Header with Red Gradient */}
        <LinearGradient
          colors={['#DC2626', '#B91C1C', '#991B1B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[deleteAccountStyles.gradientHeader, { paddingTop: insets.top + 16 }]}
        >
        <View style={deleteAccountStyles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={deleteAccountStyles.backButton}
              disabled={isLoading}
            >
              <Ionicons 
                name="arrow-back" 
                size={24} 
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <View>
              <Text style={deleteAccountStyles.gradientHeaderTitle}>
                Delete Account
              </Text>
            </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={deleteAccountStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
          {/* Warning Banner */}
          <View style={[
            deleteAccountStyles.warningBanner,
            isDark ? deleteAccountStyles.warningBannerDark : deleteAccountStyles.warningBannerLight
          ]}>
            <View style={deleteAccountStyles.warningBannerRow}>
              <View style={[
                deleteAccountStyles.warningIconContainer,
                isDark ? deleteAccountStyles.warningIconContainerDark : deleteAccountStyles.warningIconContainerLight
              ]}>
                <Ionicons name="alert-circle" size={28} color="#DC2626" />
              </View>
              <View style={deleteAccountStyles.warningTextContainer}>
                <Text style={[
                  deleteAccountStyles.warningTitle,
                  isDark ? deleteAccountStyles.warningTitleDark : deleteAccountStyles.warningTitleLight
                ]}>
                  Danger Zone
                </Text>
                <Text style={[
                  deleteAccountStyles.warningSubtext,
                  isDark ? deleteAccountStyles.warningSubtextDark : deleteAccountStyles.warningSubtextLight
                ]}>
                  This action is permanent and cannot be undone
                </Text>
              </View>
            </View>
          </View>

          {/* What will be deleted */}
          <View style={[
            deleteAccountStyles.card,
            isDark ? deleteAccountStyles.cardDark : deleteAccountStyles.cardLight
          ]}>
            <View style={deleteAccountStyles.cardHeader}>
              <View style={[
                deleteAccountStyles.cardIconContainer,
                isDark ? deleteAccountStyles.redIconContainerDark : deleteAccountStyles.redIconContainerLight
              ]}>
                <Ionicons name="trash-outline" size={22} color="#DC2626" />
              </View>
              <Text style={[
                deleteAccountStyles.cardTitle,
                isDark ? deleteAccountStyles.cardTitleDark : deleteAccountStyles.cardTitleLight
              ]}>
                What Will Be Deleted
              </Text>
            </View>

            <Text style={[
              deleteAccountStyles.deletionWarningText,
              isDark ? deleteAccountStyles.deletionWarningTextDark : deleteAccountStyles.deletionWarningTextLight
            ]}>
              Once you delete your account, there is no going back. This will permanently delete:
            </Text>

            <View>
              {[
                { icon: 'person', text: 'Your profile and personal information' },
                { icon: 'barbell', text: 'All your workouts and workout templates' },
                { icon: 'nutrition', text: 'Your nutrition data and goals' },
                { icon: 'chatbox', text: 'All posts and social interactions' },
                { icon: 'mail', text: 'Messages and notifications' },
                { icon: 'folder', text: 'Custom categories and exercises' },
              ].map((item, index) => (
                <View key={index} style={deleteAccountStyles.listItem}>
                  <View style={[
                    deleteAccountStyles.listIconContainer,
                    isDark ? deleteAccountStyles.listIconContainerDark : deleteAccountStyles.listIconContainerLight
                  ]}>
                    <Ionicons name={item.icon as any} size={14} color="#DC2626" />
                  </View>
                  <Text style={[
                    deleteAccountStyles.listItemText,
                    isDark ? deleteAccountStyles.listItemTextDark : deleteAccountStyles.listItemTextLight
                  ]}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Confirmation Input */}
          <View style={[
            deleteAccountStyles.card,
            isDark ? deleteAccountStyles.cardDark : deleteAccountStyles.cardLight
          ]}>
            <View style={deleteAccountStyles.cardHeader}>
              <View style={[
                deleteAccountStyles.cardIconContainer,
                isDark ? deleteAccountStyles.orangeIconContainerDark : deleteAccountStyles.orangeIconContainerLight
              ]}>
                <Ionicons name="warning" size={22} color="#EA580C" />
              </View>
              <Text style={[
                deleteAccountStyles.cardTitle,
                isDark ? deleteAccountStyles.cardTitleDark : deleteAccountStyles.cardTitleLight
              ]}>
                Confirm Deletion
              </Text>
            </View>

            <Text style={[
              deleteAccountStyles.confirmationText,
              isDark ? deleteAccountStyles.confirmationTextDark : deleteAccountStyles.confirmationTextLight
            ]}>
              To confirm, type{' '}
              <Text style={[
                deleteAccountStyles.confirmationBold,
                isDark ? deleteAccountStyles.confirmationBoldDark : deleteAccountStyles.confirmationBoldLight
              ]}>
                DELETE
              </Text>{' '}
              in the box below:
            </Text>

            <TextInput
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="DELETE"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!isLoading}
              style={[
                deleteAccountStyles.textInput,
                isDark ? deleteAccountStyles.textInputDark : deleteAccountStyles.textInputLight
              ]}
            />
          </View>

          {/* Action Buttons */}
          <View style={deleteAccountStyles.buttonContainer}>
            <TouchableOpacity
              onPress={handleDeleteAccount}
              disabled={isDeleteDisabled}
              style={[
                deleteAccountStyles.button,
                isDeleteDisabled
                  ? [
                      deleteAccountStyles.deleteButtonDisabled,
                      isDark && deleteAccountStyles.deleteButtonDisabledDark
                    ]
                  : deleteAccountStyles.deleteButton
              ]}
              activeOpacity={0.8}
            >
              <Text style={[
                deleteAccountStyles.buttonText,
                deleteAccountStyles.buttonTextWhite
              ]}>
                {isLoading ? 'Deleting Account...' : 'Delete My Account'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              disabled={isLoading}
              style={[
                deleteAccountStyles.button,
                deleteAccountStyles.cancelButton,
                isDark ? deleteAccountStyles.cancelButtonDark : deleteAccountStyles.cancelButtonLight
              ]}
              activeOpacity={0.8}
            >
              <Text style={[
                deleteAccountStyles.buttonText,
                isDark ? deleteAccountStyles.buttonTextDark : deleteAccountStyles.buttonTextLight
              ]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>

          {/* Additional Warning */}
          <View style={[
            deleteAccountStyles.infoBox,
            isDark ? deleteAccountStyles.infoBoxDark : deleteAccountStyles.infoBoxLight
          ]}>
            <View style={deleteAccountStyles.infoBoxRow}>
              <Ionicons
                name="information-circle"
                size={20}
                color="#EA580C"
                style={deleteAccountStyles.infoIcon}
              />
              <Text style={[
                deleteAccountStyles.infoBoxText,
                isDark ? deleteAccountStyles.infoBoxTextDark : deleteAccountStyles.infoBoxTextLight
              ]}>
                This action is immediate and irreversible. Make sure you have backed up any data you wish to keep.
              </Text>
            </View>
          </View>
      </ScrollView>
      </View>
    </>
  );
};

export default DeleteAccountScreen;

