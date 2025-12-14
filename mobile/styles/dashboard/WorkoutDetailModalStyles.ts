import { StyleSheet } from 'react-native';

const WorkoutDetailModalStyles = (isDark: boolean) =>
    StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContainer: {
            flex: 1,
            marginTop: 64,
            backgroundColor: isDark ? '#111827' : '#f9fafb',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
        },
        header: {
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#374151' : '#e5e7eb',
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        headerIconContainer: {
            padding: 10,
            borderRadius: 12,
        },
        headerIconContainerTemplate: {
            backgroundColor: '#f3e8ff',
        },
        headerIconContainerFreestyle: {
            backgroundColor: '#dbeafe',
        },
        headerCenter: {
            flex: 1,
            alignItems: 'center',
            marginHorizontal: 12,
        },
        workoutTypeBadge: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
        },
        workoutTypeBadgeTemplate: {
            backgroundColor: isDark ? 'rgba(147, 51, 234, 0.3)' : '#f3e8ff',
        },
        workoutTypeBadgeFreestyle: {
            backgroundColor: isDark ? 'rgba(37, 99, 235, 0.3)' : '#dbeafe',
        },
        workoutTypeText: {
            fontSize: 20,
            fontWeight: '600',
        },
        workoutTypeTextTemplate: {
            color: isDark ? '#d8b4fe' : '#7e22ce',
        },
        workoutTypeTextFreestyle: {
            color: isDark ? '#93c5fd' : '#1d4ed8',
        },
        closeButton: {
            backgroundColor: isDark ? '#374151' : '#f3f4f6',
            borderRadius: 9999,
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
        },
        dateRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        dateText: {
            fontSize: 12,
            color: isDark ? '#9ca3af' : '#6b7280',
            marginLeft: 6,
        },
        scrollView: {
            flex: 1,
        },
        statsContainer: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            padding: 16,
            marginBottom: 8,
        },
        statsRowTop: {
            flexDirection: 'row',
            gap: 12,
            marginBottom: 12,
        },
        statsRowBottom: {
            flexDirection: 'row',
            gap: 12,
        },
        statCard: {
            flex: 1,
            padding: 16,
            borderRadius: 12,
        },
        statCardBlue: {
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : '#eff6ff',
        },
        statCardGreen: {
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#f0fdf4',
        },
        statCardOrange: {
            backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#fff7ed',
        },
        statCardPurple: {
            backgroundColor: isDark ? 'rgba(139, 92, 246, 0.2)' : '#faf5ff',
        },
        statHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        statIconContainer: {
            padding: 6,
            borderRadius: 8,
        },
        statIconBlue: {
            backgroundColor: '#3b82f6',
        },
        statIconGreen: {
            backgroundColor: '#10b981',
        },
        statIconOrange: {
            backgroundColor: '#f59e0b',
        },
        statIconPurple: {
            backgroundColor: '#8b5cf6',
        },
        statLabel: {
            fontSize: 12,
            color: isDark ? '#9ca3af' : '#6b7280',
            marginLeft: 8,
            fontWeight: '600',
        },
        statValue: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        statValueBlue: {
            color: isDark ? '#93c5fd' : '#1e40af',
        },
        statValueGreen: {
            color: isDark ? '#6ee7b7' : '#065f46',
        },
        statValueOrange: {
            color: isDark ? '#fbbf24' : '#92400e',
        },
        statValuePurple: {
            color: isDark ? '#c4b5fd' : '#6b21a8',
        },
        exercisesContainer: {
            padding: 16,
            paddingTop: 8,
        },
        exercisesTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#ffffff' : '#111827',
            marginBottom: 16,
        },
        exerciseCard: {
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            borderRadius: 12,
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#3b82f6',
            overflow: 'hidden',
        },
        exerciseHeader: {
            padding: 16,
        },
        exerciseHeaderRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        exerciseNumber: {
            width: 32,
            height: 32,
            backgroundColor: '#3b82f6',
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        exerciseNumberText: {
            color: '#ffffff',
            fontSize: 14,
            fontWeight: '600',
        },
        exerciseName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: isDark ? '#ffffff' : '#111827',
            flex: 1,
        },
        setsTable: {
            backgroundColor: isDark ? '#111827' : '#f9fafb',
            borderRadius: 8,
            overflow: 'hidden',
        },
        tableHeaderRow: {
            flexDirection: 'row',
            paddingVertical: 10,
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#374151' : '#e5e7eb',
        },
        tableHeaderText: {
            flex: 1,
            fontSize: 12,
            fontWeight: '600',
            color: isDark ? '#9ca3af' : '#6b7280',
        },
        tableHeaderTextCenter: {
            flex: 1,
            fontSize: 12,
            fontWeight: '600',
            color: isDark ? '#9ca3af' : '#6b7280',
            textAlign: 'center',
        },
        tableRow: {
            flexDirection: 'row',
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1f2937' : '#f3f4f6',
        },
        tableRowCompleted: {
            flexDirection: 'row',
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1f2937' : '#f3f4f6',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#f0fdf4',
        },
        tableRowIncomplete: {
            flexDirection: 'row',
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1f2937' : '#f3f4f6',
            backgroundColor: isDark ? '#111827' : '#ffffff',
        },
        tableCellText: {
            flex: 1,
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#ffffff' : '#111827',
        },
        tableCellTextCenter: {
            flex: 1,
            fontSize: 14,
            color: isDark ? '#ffffff' : '#111827',
            textAlign: 'center',
        },
        tableFooterRow: {
            flexDirection: 'row',
            paddingVertical: 10,
            paddingHorizontal: 8,
            backgroundColor: isDark ? '#1f2937' : '#e5e7eb',
        },
        tableFooterLabel: {
            flex: 3,
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#ffffff' : '#111827',
            textAlign: 'right',
            paddingRight: 8,
        },
        tableFooterValue: {
            flex: 1,
            fontSize: 14,
            fontWeight: 'bold',
            color: isDark ? '#ffffff' : '#111827',
            textAlign: 'center',
        },
    });

export default WorkoutDetailModalStyles;
