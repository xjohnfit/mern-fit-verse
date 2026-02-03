import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionCompact: {
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardDark: {
        backgroundColor: '#1F2937',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
    },
    cardCompact: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    cardCompactDark: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardHeaderCompact: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerIcon: {
        marginRight: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    cardTitleDark: {
        fontSize: 18,
        fontWeight: '700',
        color: '#F9FAFB',
    },
    cardTitleCompact: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    cardTitleCompactDark: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F9FAFB',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statsContainerCompact: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statItemCompact: {
        flex: 1,
        alignItems: 'center',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    iconCircleCompact: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
        fontWeight: '500',
        textAlign: 'center',
    },
    statLabelDark: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 6,
        fontWeight: '500',
        textAlign: 'center',
    },
    statLabelCompact: {
        fontSize: 10,
        color: '#6B7280',
        marginBottom: 3,
        fontWeight: '500',
        textAlign: 'center',
    },
    statLabelCompactDark: {
        fontSize: 10,
        color: '#9CA3AF',
        marginBottom: 3,
        fontWeight: '500',
        textAlign: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    statValueDark: {
        fontSize: 28,
        fontWeight: '700',
        color: '#F9FAFB',
        marginBottom: 4,
    },
    statValueCompact: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 2,
    },
    statValueCompactDark: {
        fontSize: 20,
        fontWeight: '700',
        color: '#F9FAFB',
        marginBottom: 2,
    },
    statSubtitle: {
        fontSize: 11,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    statSubtitleCompact: {
        fontSize: 9,
        color: '#9CA3AF',
        textAlign: 'center',
    },
    divider: {
        width: 1,
        height: 80,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 12,
    },
    dividerDark: {
        width: 1,
        height: 80,
        backgroundColor: '#374151',
        marginHorizontal: 12,
    },
    dividerCompact: {
        width: 1,
        height: 50,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 8,
    },
    dividerCompactDark: {
        width: 1,
        height: 50,
        backgroundColor: '#374151',
        marginHorizontal: 8,
    },
});

export default styles;
