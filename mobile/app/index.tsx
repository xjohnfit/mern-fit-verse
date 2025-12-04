import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAppSelector } from "../hooks/useRedux";

export default function Index() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for the layout to mount before navigating
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isReady) {
    // Check authentication and navigate accordingly
    if (isAuthenticated) {
      return <Redirect href="/(tabs)/home" />;
    } else {
      return <Redirect href="/login" />;
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}
