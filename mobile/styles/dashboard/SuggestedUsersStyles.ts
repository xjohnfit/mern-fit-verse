import { StyleSheet } from 'react-native';

const suggestedUsersStyles = StyleSheet.create({
    // Container Styles
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
    },
    containerDark: {
        backgroundColor: '#1F2937',
    },
    loadingContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 8,
    },
    loadingContainerDark: {
        backgroundColor: '#1F2937',
    },

    // Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginLeft: 8,
    },
    headerTitleDark: {
        color: '#FFFFFF',
    },

    // User Cards Container
    cardsContainer: {
        gap: 12,
    },

    // User Card Styles
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
    },
    userCardDark: {
        backgroundColor: '#374151',
    },

    // User Info Container
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },

    // Avatar Styles
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
    },

    // User Details
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#111827',
    },
    userNameDark: {
        color: '#FFFFFF',
    },
    userUsername: {
        fontSize: 10,
        color: '#6B7280',
    },
    userUsernameDark: {
        color: '#9CA3AF',
    },

    // Follow Button Styles
    followButton: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    followButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 4,
        fontSize: 14,
    },
});

export default suggestedUsersStyles;

