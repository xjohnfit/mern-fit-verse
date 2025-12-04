import "../global.css";

import { useEffect } from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../store";
import { restoreCredentials } from "../slices/authSlice";

function RootLayoutContent() {
  useEffect(() => {
    // Restore user credentials from AsyncStorage on app start
    const restoreUser = async () => {
      try {
        const userInfo = await AsyncStorage.getItem("userInfo");
        if (userInfo) {
          store.dispatch(restoreCredentials(JSON.parse(userInfo)));
        }
      } catch (error) {
        console.error("Failed to restore user credentials:", error);
      }
    };

    restoreUser();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}
