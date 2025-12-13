import { StyleSheet } from 'react-native';

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#111827' : '#F9FAFB',
        },
        header: {
            paddingHorizontal: 20,
            paddingBottom: 28,
        },
        headerTop: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        headerIconContainer: {
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.25)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
        },
        headerTextContainer: {
            flex: 1,
        },
        headerTitle: {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#FFFFFF',
            marginBottom: 4,
        },
        headerSubtitle: {
            fontSize: 15,
            color: 'rgba(255,255,255,0.95)',
            fontWeight: '500',
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.25)',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
        },
        searchInput: {
            flex: 1,
            marginLeft: 8,
            fontSize: 16,
            color: '#FFFFFF',
        },
        listContent: {
            paddingVertical: 12,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        loadingText: {
            marginTop: 12,
            color: '#6b7280',
        },
    });

export default createStyles;


