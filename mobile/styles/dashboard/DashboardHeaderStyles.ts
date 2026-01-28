import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    gradient: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderTopLeftRadius: 47,
        borderTopRightRadius: 47,
    },
    container: {
        paddingBottom: 4,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 18,
        overflow: 'hidden',
        marginRight: 14,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    iconGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.95)',
        marginTop: 4,
        fontWeight: '500',
    },
});

export default styles;
