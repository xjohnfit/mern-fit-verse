import { StyleSheet } from 'react-native';

export const blockedUsersStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#121212' : '#f9fafb',
        },
        headerContainer: {
            paddingBottom: 24,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
        },
        headerInner: {
            paddingHorizontal: 20,
        },
        backButton: {
            marginBottom: 12,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconContainer: {
            marginRight: 16,
        },
        iconGradient: {
            width: 64,
            height: 64,
            borderRadius: 32,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: 'rgba(255, 255, 255, 0.3)',
        },
        textContainer: {
            flex: 1,
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: '#fff',
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 15,
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
        },
        contentWrapper: {
            flex: 1,
            paddingTop: 16,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        listContent: {
            paddingHorizontal: 16,
            paddingBottom: 16,
        },
        userCard: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: isDark ? '#1e1e1e' : '#fff',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 12,
        },
        avatarPlaceholder: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#6366f1',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        avatarText: {
            fontSize: 20,
            fontWeight: '600',
            color: '#fff',
        },
        userDetails: {
            flex: 1,
        },
        userName: {
            fontSize: 16,
            fontWeight: '600',
            color: isDark ? '#fff' : '#111827',
            marginBottom: 4,
        },
        userUsername: {
            fontSize: 14,
            color: isDark ? '#9ca3af' : '#6b7280',
        },
        unblockButton: {
            backgroundColor: '#6366f1',
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 8,
        },
        unblockButtonText: {
            color: '#fff',
            fontWeight: '600',
            fontSize: 14,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 32,
            paddingTop: 80,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: '600',
            color: isDark ? '#fff' : '#111827',
            marginTop: 16,
            marginBottom: 8,
        },
        emptyText: {
            fontSize: 14,
            color: isDark ? '#9ca3af' : '#6b7280',
            textAlign: 'center',
            lineHeight: 20,
        },
    });
