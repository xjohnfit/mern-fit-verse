import { StyleSheet } from 'react-native';

const FollowersModalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        flex: 1,
        marginTop: 80,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    modalContentDark: {
        flex: 1,
        marginTop: 80,
        backgroundColor: '#111827',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerDark: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    titleDark: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F3F4F6',
    },
    closeButton: {
        padding: 8,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    userItemDark: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    userPhotoContainer: {
        width: 48,
        height: 48,
        borderRadius: 9999,
        backgroundColor: '#E5E7EB',
        overflow: 'hidden',
        marginRight: 12,
    },
    userPhotoContainerDark: {
        width: 48,
        height: 48,
        borderRadius: 9999,
        backgroundColor: '#374151',
        overflow: 'hidden',
        marginRight: 12,
    },
    userPhoto: {
        width: '100%',
        height: '100%',
    },
    userPhotoPlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D1D5DB',
    },
    userPhotoPlaceholderDark: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4B5563',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontWeight: '600',
        color: '#111827',
    },
    userNameDark: {
        fontWeight: '600',
        color: '#F3F4F6',
    },
    userUsername: {
        fontSize: 14,
        color: '#6B7280',
    },
    userUsernameDark: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyText: {
        color: '#6B7280',
        textAlign: 'center',
    },
    emptyTextDark: {
        color: '#9CA3AF',
        textAlign: 'center',
    },
    listContainer: {
        flex: 1,
    },
});

export default FollowersModalStyles;
