import { StyleSheet } from 'react-native';

const SafeScreenStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#111827' : '#ffffff',
        },
    });

export default SafeScreenStyles;
