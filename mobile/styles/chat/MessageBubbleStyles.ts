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
        templateContainer: {
            maxWidth: '85%',
            minWidth: 280,
        },
        templateGradient: {
            borderRadius: 16,
            padding: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
        },
        templateHeader: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 12,
        },
        templateIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        templateInfo: {
            flex: 1,
        },
        templateTitle: {
            fontSize: 16,
            fontWeight: '700',
            marginBottom: 4,
        },
        templateDescription: {
            fontSize: 13,
            lineHeight: 18,
            marginBottom: 6,
        },
        templateStats: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        templateStatsText: {
            fontSize: 12,
            fontWeight: '500',
        },
        importButton: {
            marginTop: 8,
            borderRadius: 10,
            overflow: 'hidden',
        },
        importButtonGradient: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 16,
            gap: 8,
        },
        importButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#fff',
        },
        templateTimestamp: {
            marginTop: 8,
            fontSize: 10,
        },
    });

export default createStyles;
