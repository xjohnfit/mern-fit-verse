import { StyleSheet } from 'react-native';

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#e5e7eb',
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
        },
        imagePreviewContainer: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#e5e7eb',
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
        },
        imagePreviewWrapper: {
            position: 'relative',
        },
        imagePreview: {
            width: 100,
            height: 100,
            borderRadius: 12,
        },
        removeImageButton: {
            position: 'absolute',
            top: -8,
            right: -8,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#ef4444',
            justifyContent: 'center',
            alignItems: 'center',
        },
        inputRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        inputWrapper: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginRight: 8,
        },
        textInput: {
            flex: 1,
            fontSize: 14,
            color: isDark ? '#f9fafb' : '#1f2937',
            maxHeight: 100,
            paddingVertical: 4,
        },
        imageButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDark ? '#1f2937' : '#CFFAFE',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 8,
        },
        sendButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

export default createStyles;


