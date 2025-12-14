import { View, Text, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SafeScreenStyles from '@/styles/layout/SafeScreenStyles';

const SafeScreen = ({ children }: { children: React.ReactNode; }) => {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const styles = SafeScreenStyles(isDark);

    return (
        <View
            style={[styles.container, { paddingTop: insets.top }]}>
            {children}
        </View>
    );
};
export default SafeScreen;
