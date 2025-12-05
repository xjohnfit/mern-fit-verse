import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeScreen = ({ children }: { children: React.ReactNode }) => {
    const insets = useSafeAreaInsets();
    return (
        <View
            className='flex-1 bg-white dark:bg-gray-900'
            style={{
                paddingTop: insets.top,
            }}>
            {children}
        </View>
    );
};
export default SafeScreen;
