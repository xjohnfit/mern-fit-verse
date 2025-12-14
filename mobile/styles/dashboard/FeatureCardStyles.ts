import { StyleSheet } from 'react-native';

const FeatureCardStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            padding: 20,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
        },
        iconContainer: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 50,
            padding: 12,
            marginRight: 16,
        },
        textContainer: {
            flex: 1,
        },
        title: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 4,
        },
        description: {
            color: '#bfdbfe',
            fontSize: 14,
        },
    });

export default FeatureCardStyles;
