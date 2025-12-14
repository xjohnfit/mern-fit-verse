import { StyleSheet } from 'react-native';

const statsCardStyles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    blurView: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        marginBottom: 4,
    },
    value: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
    },
});

export default statsCardStyles;
