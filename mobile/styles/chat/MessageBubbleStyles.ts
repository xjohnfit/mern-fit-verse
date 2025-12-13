import { StyleSheet } from 'react-native';

const createStyles = (isDark: boolean, isMyMessage: boolean) =>
    StyleSheet.create({
        container: {
            marginBottom: 12,
            alignItems: isMyMessage ? 'flex-end' : 'flex-start',
        },
        bubble: {
            maxWidth: '80%',
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 10,
            backgroundColor: isMyMessage
                ? '#06b6d4'
                : isDark
                ? '#1f2937'
                : '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        image: {
            width: 200,
            height: 200,
            borderRadius: 12,
            marginBottom: 8,
        },
        text: {
            fontSize: 15,
            lineHeight: 20,
        },
        timestamp: {
            fontSize: 10,
            marginTop: 4,
        },
    });

export default createStyles;

