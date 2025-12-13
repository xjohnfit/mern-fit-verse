import React from 'react';
import { View, Text, ActivityIndicator, useColorScheme } from 'react-native';
import styles from '@/styles/nutrition/LoadingStateStyles';

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = 'Loading nutrition data...' }: LoadingStateProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <ActivityIndicator size="large" color="#10B981" />
      <Text style={[styles.text, isDark ? styles.textDark : styles.textLight]}>
        {message}
      </Text>
    </View>
  );
};

export default LoadingState;

