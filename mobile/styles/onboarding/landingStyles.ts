import { StyleSheet } from 'react-native';

const LandingStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            justifyContent: 'space-between',
        },
        headerSection: {
            paddingTop: 60,
            paddingHorizontal: 24,
            alignItems: 'center',
        },
        logoContainer: {
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 10,
        },
        logo: {
            width: 100,
            height: 100,
        },
        title: {
            fontSize: 42,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 8,
            letterSpacing: 1,
        },
        subtitle: {
            fontSize: 16,
            color: '#bfdbfe',
            textAlign: 'center',
            fontWeight: '500',
        },
        heroSection: {
            paddingHorizontal: 24,
            marginTop: 40,
            marginBottom: 32,
        },
        heroText: {
            color: '#ffffff',
            fontSize: 17,
            textAlign: 'center',
            marginBottom: 40,
            lineHeight: 26,
            fontWeight: '400',
            opacity: 0.95,
        },
        featuresContainer: {
            gap: 16,
        },
        ctaSection: {
            paddingHorizontal: 24,
            paddingBottom: 20,
        },
        primaryButton: {
            backgroundColor: '#ffffff',
            borderRadius: 16,
            paddingVertical: 18,
            marginBottom: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 10,
        },
        primaryButtonText: {
            color: '#2563eb',
            textAlign: 'center',
            fontSize: 17,
            fontWeight: 'bold',
            letterSpacing: 0.5,
        },
        secondaryButton: {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 16,
            paddingVertical: 18,
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
        },
        secondaryButtonText: {
            color: '#ffffff',
            textAlign: 'center',
            fontSize: 17,
            fontWeight: '600',
            letterSpacing: 0.5,
        },
        footerText: {
            color: '#bfdbfe',
            textAlign: 'center',
            marginTop: 20,
            fontSize: 13,
            opacity: 0.9,
            fontWeight: '400',
        },
    });

export default LandingStyles;
