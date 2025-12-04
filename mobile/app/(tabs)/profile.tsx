import { View, Text } from "react-native";
import { useAppSelector } from "../../hooks/useRedux";

export default function ProfileScreen() {
    const { userInfo } = useAppSelector((state) => state.auth);

    return (
        <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 px-6">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Profile
            </Text>
            <Text className="text-lg text-gray-600 dark:text-gray-400">
                Username: {userInfo?.username}
            </Text>
            <Text className="text-lg text-gray-600 dark:text-gray-400">
                Email: {userInfo?.email}
            </Text>
        </View>
    );
}
