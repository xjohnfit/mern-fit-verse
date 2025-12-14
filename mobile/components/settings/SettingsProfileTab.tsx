import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  useColorScheme,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setCredentials } from '../../slices/authSlice';
import { useUpdateUserProfileMutation } from '../../slices/usersApiSlice';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import SettingsProfileTabStyles from '@/styles/settings/SettingsProfileTabStyles';

interface SettingsProfileTabProps {
  onLogout: () => void;
}

const SettingsProfileTab: React.FC<SettingsProfileTabProps> = ({ onLogout }) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = SettingsProfileTabStyles(isDark);
  const { userInfo } = useAppSelector((state) => state.auth);

  const [updateUserProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

  // Profile state
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

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Update local UI immediately
        setPhotoUri(asset.uri);

        // Upload photo automatically
        if (asset.base64) {
          setIsUploadingPhoto(true);
          try {
            // Determine image format from URI or default to jpeg
            let mimeType = 'image/jpeg';
            if (asset.uri.toLowerCase().includes('.png')) {
              mimeType = 'image/png';
            } else if (asset.uri.toLowerCase().includes('.gif')) {
              mimeType = 'image/gif';
            } else if (asset.uri.toLowerCase().includes('.webp')) {
              mimeType = 'image/webp';
            }

            const base64Image = `data:${mimeType};base64,${asset.base64}`;

            const result = await updateUserProfile({ photo: base64Image }).unwrap();
            dispatch(setCredentials(result));
          } catch (error: any) {
            console.error('Photo upload failed:', error);
            // Revert UI on error
            setPhotoUri(userInfo?.photo || null);
            Toast.show({
              type: 'error',
              text1: 'Upload Failed',
              text2: error?.data?.message || 'Failed to upload photo',
            });
          } finally {
            setIsUploadingPhoto(false);
          }
        }
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

      // Photo is handled separately in handlePickImage, so we don't include it here

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

  return (
    <View style={styles.container}>
      {/* Profile Photo */}
      <View style={styles.photoSection}>
        <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} disabled={isUploadingPhoto}>
          <View style={styles.imageContainer}>
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons
                  name="person"
                  size={70}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
              </View>
            )}
            {isUploadingPhoto && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color="white" />
              </View>
            )}
            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={22} color="white" />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.profileName}>
          {userInfo?.name || 'Your Name'}
        </Text>
        <Text style={styles.profileUsername}>
          @{userInfo?.username || 'username'}
        </Text>
      </View>

      {/* Basic Info */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIndicatorBlue} />
          <Text style={styles.sectionTitle}>
            Basic Information
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Full Name
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Username
          </Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            style={styles.textInput}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            keyboardType="email-address"
            style={styles.textInput}
          />
        </View>

        <View>
          <Text style={styles.inputLabel}>
            Date of Birth
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <View style={styles.dateButton}>
              <Text style={dob ? styles.dateButtonText : styles.dateButtonPlaceholder}>
                {dob ? formatDateForDisplay(dob) : 'Select date of birth'}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={isDark ? '#9CA3AF' : '#6B7280'}
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
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIndicatorPurple} />
          <Text style={styles.sectionTitle}>
            Physical Information
          </Text>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>
              Height (cm)
            </Text>
            <TextInput
              value={height}
              onChangeText={setHeight}
              placeholder="0"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              keyboardType="numeric"
              style={styles.textInput}
            />
          </View>

          <View style={styles.halfInputContainer}>
            <Text style={styles.inputLabel}>
              Weight (lbs)
            </Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="0"
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              keyboardType="numeric"
              style={styles.textInput}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Gender
          </Text>
          <View style={styles.genderButtonsContainer}>
            {['male', 'female', 'other'].map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                style={gender === g ? styles.genderButtonActive : styles.genderButton}
                activeOpacity={0.7}
              >
                <Text
                  style={gender === g ? styles.genderButtonTextActive : styles.genderButtonText}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.inputLabel}>
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
              style={[
                goal === g.value ? styles.goalButtonActive : styles.goalButton,
                index > 0 && styles.goalButtonSpacing
              ]}
              activeOpacity={0.7}
            >
              <View
                style={goal === g.value ? styles.goalIconContainerActive : styles.goalIconContainer}
              >
                <Ionicons
                  name={g.icon as any}
                  size={20}
                  color={
                    goal === g.value
                      ? '#FFFFFF'
                      : isDark
                        ? '#9CA3AF'
                        : '#6B7280'
                  }
                />
              </View>
              <Text
                style={goal === g.value ? styles.goalButtonTextActive : styles.goalButtonText}
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
      <View style={styles.updateButton}>
        <TouchableOpacity
          onPress={handleUpdateProfile}
          disabled={isUpdating}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.updateButtonGradient}
          >
            {isUpdating ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Ionicons name="save" size={22} color="white" />
                <Text style={styles.updateButtonText}>Update Profile</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={onLogout}
        style={styles.logoutButton}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out" size={20} color="white" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsProfileTab;

