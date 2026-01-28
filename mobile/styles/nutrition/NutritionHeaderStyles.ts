import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    gradient: {
        paddingHorizontal: 20,
        paddingBottom: 28,
        borderTopLeftRadius: 47,
        borderTopRightRadius: 47,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.95)',
        fontWeight: '500',
    },
});
export default styles;
