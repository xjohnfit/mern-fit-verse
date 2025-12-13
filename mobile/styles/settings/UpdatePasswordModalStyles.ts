import { StyleSheet } from 'react-native';

const updatePasswordModalStyles = StyleSheet.create({
    // Modal Container
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        width: '100%',
        maxWidth: 500,
        height: '85%',
        overflow: 'hidden',
    },
    modalContainerDark: {
        backgroundColor: '#1F2937',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerDark: {
        borderBottomColor: '#374151',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#DBEAFE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIconDark: {
        backgroundColor: '#3B82F6',
    },
    headerTextContainer: {
        // No specific styles needed, just for structure
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerTitleDark: {
        color: '#F9FAFB',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    headerSubtitleDark: {
        color: '#9CA3AF',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonDark: {
        backgroundColor: '#374151',
    },

    // Content
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        padding: 20,
        paddingBottom: 40,
    },

    // Security Notice
    securityNotice: {
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        flexDirection: 'row',
        gap: 12,
    },
    securityNoticeDark: {
        backgroundColor: '#1E3A8A',
    },
    securityNoticeIcon: {
        marginTop: 2,
    },
    securityNoticeTextContainer: {
        flex: 1,
    },
    securityNoticeText: {
        fontSize: 14,
        color: '#1E40AF',
        lineHeight: 20,
    },
    securityNoticeTextDark: {
        color: '#BFDBFE',
    },

    // Input Field Container
    inputContainer: {
        marginBottom: 16,
    },
    inputContainerLast: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputLabelDark: {
        color: '#F9FAFB',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
    },
    inputWrapperDark: {
        backgroundColor: '#374151',
        borderColor: '#4B5563',
    },
    inputIcon: {
        // Icon styling handled by Ionicons
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        fontSize: 15,
        color: '#111827',
    },
    inputDark: {
        color: '#F9FAFB',
    },
    inputHint: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 6,
    },
    inputHintDark: {
        color: '#6B7280',
    },

    // Update Button
    updateButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    updateButtonDisabled: {
        backgroundColor: '#E5E7EB',
    },
    updateButtonDisabledDark: {
        backgroundColor: '#374151',
    },
    updateButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    updateButtonTextDisabled: {
        color: '#9CA3AF',
    },
    updateButtonTextDisabledDark: {
        color: '#6B7280',
    },
});

export default updatePasswordModalStyles;

