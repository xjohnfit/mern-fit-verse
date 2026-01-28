import { StyleSheet } from 'react-native';

const settingsStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#111827' : '#ffffff',
        },
        scrollView: {
            flex: 1,
        },
        headerContainer: {
            paddingHorizontal: 20,
            paddingBottom: 24,
            borderTopLeftRadius: 47,
            borderTopRightRadius: 47,
        },
        headerInner: {
            paddingTop: 16,
            paddingBottom: 4,
        },
        headerContent: {
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
        contentWrapper: {
            paddingHorizontal: 16,
            paddingVertical: 24,
        },
        tabsContainer: {
            flexDirection: 'row',
            marginBottom: 16,
        },
        tabButton: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            marginRight: 8,
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#e5e7eb',
        },
        tabButtonLast: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#e5e7eb',
        },
        tabButtonActive: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            marginRight: 8,
            backgroundColor: '#4f46e5',
            borderWidth: 0,
        },
        tabButtonLastActive: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: '#4f46e5',
            borderWidth: 0,
        },
        tabText: {
            textAlign: 'center',
            fontWeight: '600',
            color: isDark ? '#ffffff' : '#111827',
        },
        tabTextActive: {
            textAlign: 'center',
            fontWeight: '600',
            color: '#ffffff',
        },
        bottomSpacer: {
            height: 32,
        },
    });

export default settingsStyles;
