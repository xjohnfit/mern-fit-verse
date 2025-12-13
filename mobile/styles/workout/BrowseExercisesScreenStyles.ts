import { StyleSheet } from 'react-native';

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0f172a' : '#f9fafb',
    },
    header: {
      paddingBottom: 16,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitleContainer: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    headerSubtitle: {
      fontSize: 13,
      color: 'rgba(255, 255, 255, 0.8)',
      marginTop: 2,
    },
    headerSpacer: {
      width: 40,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 12,
      paddingHorizontal: 16,
      marginHorizontal: 16,
      marginTop: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 12,
      fontSize: 16,
      color: '#FFFFFF',
    },
    exerciseList: {
      flex: 1,
    },
    exerciseListContent: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 20,
    },
    exerciseLoadingContainer: {
      alignItems: 'center',
      paddingVertical: 60,
    },
    exerciseLoadingText: {
      marginTop: 16,
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    exerciseGrid: {
      gap: 20,
      paddingBottom: 20,
    },
    categorySection: {
      marginBottom: 8,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#111827' : '#F3E8FF',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 12,
      gap: 10,
    },
    categoryIconCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDark ? '#374151' : '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#FFFFFF' : '#7E22CE',
      flex: 1,
    },
    categoryBadge: {
      backgroundColor: isDark ? '#7E22CE' : '#9333EA',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoryBadgeText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    categoryExercises: {
      gap: 10,
    },
    exerciseCard: {
      backgroundColor: isDark ? '#111827' : '#F9FAFB',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
    },
    exerciseCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    exerciseIconCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? '#374151' : '#F3E8FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      overflow: 'hidden',
    },
    exerciseImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    exerciseInfo: {
      flex: 1,
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#111827',
    },
    exerciseDescription: {
      fontSize: 14,
      color: isDark ? '#D1D5DB' : '#6B7280',
      lineHeight: 20,
    },
    exerciseEmptyState: {
      alignItems: 'center',
      paddingVertical: 60,
    },
    exerciseEmptyText: {
      fontSize: 16,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 16,
      textAlign: 'center',
    },
  });

export default createStyles;

