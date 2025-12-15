import { StyleSheet } from 'react-native';

const OptionMenuModalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 16,
        padding: 8,
        width: '80%',
        maxWidth: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    modalContentLight: {
        backgroundColor: '#FFFFFF',
    },
    modalContentDark: {
        backgroundColor: '#1F2937',
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    reportIconContainerLight: {
        backgroundColor: '#FEE2E2',
    },
    reportIconContainerDark: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    blockIconContainerLight: {
        backgroundColor: '#FEE2E2',
    },
    blockIconContainerDark: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    optionTitleLight: {
        color: '#111827',
    },
    optionTitleDark: {
        color: '#F3F4F6',
    },
    optionSubtitle: {
        fontSize: 12,
    },
    optionSubtitleLight: {
        color: '#6B7280',
    },
    optionSubtitleDark: {
        color: '#9CA3AF',
    },
    divider: {
        height: 1,
        marginHorizontal: 16,
    },
    dividerLight: {
        backgroundColor: '#E5E7EB',
    },
    dividerDark: {
        backgroundColor: '#374151',
    },
    cancelButton: {
        marginTop: 8,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonLight: {
        backgroundColor: '#F3F4F6',
    },
    cancelButtonDark: {
        backgroundColor: '#374151',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButtonTextLight: {
        color: '#374151',
    },
    cancelButtonTextDark: {
        color: '#F3F4F6',
    },
});

export default OptionMenuModalStyles;
