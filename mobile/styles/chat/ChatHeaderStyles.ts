import { StyleSheet } from 'react-native';

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        backButton: {
            marginRight: 12,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(255,255,255,0.25)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        avatarContainer: {
            position: 'relative',
        },
        avatar: {
            width: 44,
            height: 44,
            borderRadius: 22,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.5)',
        },
        avatarPlaceholder: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.35)',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.5)',
        },
        avatarText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 'bold',
        },
        onlineIndicator: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#3B82F6',
            borderWidth: 2,
            borderColor: '#06b6d4',
        },
        offlineIndicator: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#6B7280',
            borderWidth: 2,
            borderColor: '#06b6d4',
        },
        userInfo: {
            flex: 1,
            marginLeft: 12,
        },
        userName: {
            fontSize: 18,
            fontWeight: '700',
            color: '#FFFFFF',
        },
        userStatus: {
            fontSize: 13,
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '500',
        },
    });

export default createStyles;

