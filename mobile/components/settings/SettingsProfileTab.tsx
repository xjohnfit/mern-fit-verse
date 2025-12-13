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

interface SettingsProfileTabProps {
  onLogout: () => void;
}

const SettingsProfileTab: React.FC<SettingsProfileTabProps> = ({ onLogout }) => {
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();
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
    <View className="pb-6">
      {/* Profile Photo */}
      <View className="items-center mb-8 mt-2">
        <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} disabled={isUploadingPhoto}>
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
            {isUploadingPhoto && (
              <View className="absolute inset-0 w-36 h-36 rounded-full bg-black/50 items-center justify-center">
                <ActivityIndicator size="large" color="white" />
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
            onChangeText={setUsername}
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
                className={`flex-1 px-4 py-4 rounded-2xl border-2 ${
                  gender === g
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-center font-semibold text-base capitalize ${
                    gender === g ? 'text-white' : 'text-gray-900 dark:text-white'
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
              className={`flex-row items-center px-5 py-4 rounded-2xl border-2 ${
                index > 0 ? 'mt-3' : ''
              } ${
                goal === g.value
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
              activeOpacity={0.7}
            >
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  goal === g.value ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-700'
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
                className={`ml-4 font-semibold text-base flex-1 ${
                  goal === g.value
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
        onPress={onLogout}
        className="flex-row items-center justify-center bg-red-600 px-6 py-4 rounded-xl"
        activeOpacity={0.8}
      >
        <Ionicons name="log-out" size={20} color="white" />
        <Text className="text-white font-bold text-base ml-2">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsProfileTab;

