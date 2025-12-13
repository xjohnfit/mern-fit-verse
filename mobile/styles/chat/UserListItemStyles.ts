import { StyleSheet } from 'react-native';

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 14,
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            marginHorizontal: 16,
            marginVertical: 4,
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        avatarContainer: {
            position: 'relative',
        },
        avatar: {
            width: 52,
            height: 52,
            borderRadius: 26,
        },
        avatarPlaceholder: {
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: '#06b6d4',
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatarText: {
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 'bold',
        },
        onlineIndicator: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: '#3B82F6',
            borderWidth: 2,
        },
        offlineIndicator: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: '#6B7280',
            borderWidth: 2,
        },
        userInfo: {
            flex: 1,
            marginLeft: 14,
        },
        userName: {
            fontSize: 17,
            fontWeight: '600',
        },
        userStatus: {
            fontSize: 14,
            marginTop: 2,
            fontWeight: '500',
        },
    });

export default createStyles;

