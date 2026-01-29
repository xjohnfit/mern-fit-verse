import { StyleSheet } from 'react-native';

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        messagesContainer: {
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark ? '#111827' : '#F9FAFB',
        },
        loadingText: {
            marginTop: 12,
            color: isDark ? '#9CA3AF' : '#6b7280',
        },
        loadingMoreContainer: {
            paddingVertical: 16,
            alignItems: 'center',
        },
        loadingMoreText: {
            marginTop: 8,
            color: isDark ? '#9CA3AF' : '#6b7280',
            fontSize: 12,
        },
        noMoreMessagesContainer: {
            paddingVertical: 12,
            alignItems: 'center',
        },
        noMoreMessagesText: {
            color: isDark ? '#6B7280' : '#9ca3af',
            fontSize: 12,
        },
    });

export default createStyles;
