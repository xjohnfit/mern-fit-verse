import { StyleSheet } from 'react-native';

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
        },
        iconContainer: {
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
        },
        title: {
            fontSize: 18,
            fontWeight: '600',
            marginTop: 8,
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 14,
            color: '#6b7280',
            textAlign: 'center',
        },
    });

export default createStyles;

