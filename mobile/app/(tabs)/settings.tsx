import SafeScreen from '@/components/layout/SafeScreen';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../../hooks/useRedux';
import { clearCredentials } from '../../slices/authSlice';
import { useLogoutMutation } from '../../slices/usersApiSlice';

const settings = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeScreen>
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</Text>
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};
export default settings;