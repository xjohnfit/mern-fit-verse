import { StyleSheet } from 'react-native';

const HelpAndSupportStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#111827' : '#F9FAFB',
        },
        header: {
            backgroundColor: '#3b82f6',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingBottom: 16,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerCenter: {
            flex: 1,
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: '#FFFFFF',
        },
        headerRight: {
            width: 40,
        },
        scrollView: {
            flex: 1,
        },
        scrollViewContent: {
            padding: 20,
            paddingBottom: 40,
        },
        infoCard: {
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
            padding: 16,
            borderRadius: 12,
            marginBottom: 24,
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        infoIcon: {
            marginRight: 12,
            marginTop: 2,
        },
        infoTextContainer: {
            flex: 1,
        },
        infoText: {
            fontSize: 14,
            lineHeight: 20,
            color: isDark ? '#93c5fd' : '#1e40af',
        },
        fieldContainer: {
            marginBottom: 20,
        },
        fieldLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#e5e7eb' : '#374151',
            marginBottom: 8,
        },
        disabledField: {
            backgroundColor: isDark ? '#374151' : '#f3f4f6',
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: isDark ? '#4b5563' : '#e5e7eb',
        },
        disabledFieldText: {
            fontSize: 15,
            color: isDark ? '#9ca3af' : '#6b7280',
        },
        messageContainer: {
            marginBottom: 24,
        },
        textInput: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 16,
            fontSize: 15,
            color: isDark ? '#ffffff' : '#111827',
            borderWidth: 1,
            borderColor: isDark ? '#374151' : '#d1d5db',
            minHeight: 140,
            maxHeight: 200,
        },
        characterCount: {
            fontSize: 12,
            color: isDark ? '#6b7280' : '#9ca3af',
            marginTop: 8,
            textAlign: 'right',
        },
        sendButton: {
            backgroundColor: '#3b82f6',
            borderRadius: 12,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            shadowColor: '#3b82f6',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        sendButtonText: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '600',
        },
        sendButtonDisabled: {
            backgroundColor: isDark ? '#374151' : '#d1d5db',
            borderRadius: 12,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
        },
        sendButtonTextDisabled: {
            color: isDark ? '#6b7280' : '#9ca3af',
            fontSize: 16,
            fontWeight: '600',
        },
    });

export default HelpAndSupportStyles;
