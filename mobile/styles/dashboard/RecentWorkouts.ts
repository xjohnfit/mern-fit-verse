import { StyleSheet } from 'react-native';

const recentWorkoutsStyles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerTitleDark: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seeAllButton: {
        marginLeft: 8,
    },
    seeAllText: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '600',
    },
    seeAllTextDark: {
        fontSize: 14,
        color: '#60A5FA',
        fontWeight: '600',
    },
    loadingContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainerDark: {
        backgroundColor: '#1F2937',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: '#6B7280',
        marginTop: 12,
    },
    loadingTextDark: {
        color: '#9CA3AF',
        marginTop: 12,
    },
    emptyContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
    },
    emptyContainerDark: {
        backgroundColor: '#1F2937',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
    },
    emptyIconWrapper: {
        backgroundColor: '#F3F4F6',
        borderRadius: 40,
        padding: 16,
        marginBottom: 12,
    },
    emptyIconWrapperDark: {
        backgroundColor: '#374151',
        borderRadius: 40,
        padding: 16,
        marginBottom: 12,
    },
    emptyTitle: {
        color: '#111827',
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 4,
    },
    emptyTitleDark: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 4,
    },
    emptySubtitle: {
        color: '#6B7280',
        textAlign: 'center',
        fontSize: 14,
    },
    emptySubtitleDark: {
        color: '#9CA3AF',
        textAlign: 'center',
        fontSize: 14,
    },
    workoutsContainer: {
        gap: 16,
    },
    workoutCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    workoutCardDark: {
        backgroundColor: '#1F2937',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    workoutHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    workoutHeaderDark: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    workoutTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    workoutTypeName: {
        fontSize: 20,
        color: '#4B5563',
        marginLeft: 4,
        fontWeight: '500',
    },
    workoutTypeNameDark: {
        fontSize: 20,
        color: '#9CA3AF',
        marginLeft: 4,
        fontWeight: '500',
    },
    dateBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    dateBadgeDark: {
        backgroundColor: '#374151',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    dateText: {
        fontSize: 12,
        color: '#4B5563',
        fontWeight: '600',
    },
    dateTextDark: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
    },
    statsSection: {
        padding: 16,
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    statItem: {
        flex: 1,
        marginRight: 8,
    },
    statItemLeft: {
        flex: 1,
        marginLeft: 8,
    },
    statLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    statLabelText: {
        fontSize: 12,
        color: '#4B5563',
        marginLeft: 4,
        fontWeight: '600',
    },
    statLabelTextDark: {
        fontSize: 12,
        color: '#9CA3AF',
        marginLeft: 4,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    statValueDark: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    progressBar: {
        backgroundColor: '#E5E7EB',
        height: 6,
        borderRadius: 9999,
        overflow: 'hidden',
    },
    progressBarDark: {
        backgroundColor: '#374151',
        height: 6,
        borderRadius: 9999,
        overflow: 'hidden',
    },
    progressText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
        textAlign: 'center',
    },
    progressTextDark: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
        textAlign: 'center',
    },
});

export default recentWorkoutsStyles;
