import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  containerDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#10B98120',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  foodNameLight: {
    color: '#111827',
  },
  foodNameDark: {
    color: '#FFFFFF',
  },
  servingDescription: {
    fontSize: 13,
  },
  servingDescriptionLight: {
    color: '#6B7280',
  },
  servingDescriptionDark: {
    color: '#9CA3AF',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  nutritionItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    flex: 1,
    minWidth: '47%',
    borderWidth: 2,
  },
  nutritionItemLight: {
    backgroundColor: '#F9FAFB',
  },
  nutritionItemDark: {
    backgroundColor: '#111827',
  },
  caloriesBorder: {
    borderColor: '#10B98130',
  },
  proteinBorder: {
    borderColor: '#3B82F630',
  },
  carbsBorder: {
    borderColor: '#F59E0B30',
  },
  fatsBorder: {
    borderColor: '#EF444430',
  },
  nutritionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  nutritionLabel: {
    fontSize: 11,
    marginLeft: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  nutritionLabelLight: {
    color: '#6B7280',
  },
  nutritionLabelDark: {
    color: '#9CA3AF',
  },
  nutritionValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caloriesValue: {
    color: '#111827',
  },
  caloriesValueDark: {
    color: '#FFFFFF',
  },
  proteinValue: {
    color: '#3B82F6',
  },
  carbsValue: {
    color: '#F59E0B',
  },
  fatsValue: {
    color: '#EF4444',
  },
});

export default styles;

