import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAppSelector, useAppDispatch } from "../../hooks/useRedux";
import { clearCredentials } from "../../slices/authSlice";
import { useLogoutMutation } from "../../slices/usersApiSlice";

export default function HomeScreen() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector((state) => state.auth);
    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            dispatch(clearCredentials());
            router.replace("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 px-6">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome, {userInfo?.name || userInfo?.username || "User"}!
            </Text>
            <Text className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                You're now logged in to FitVerse
            </Text>
            <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-600 px-6 py-3 rounded-xl"
            >
                <Text className="text-white font-semibold">Logout</Text>
            </TouchableOpacity>
        </View>
    );
}
