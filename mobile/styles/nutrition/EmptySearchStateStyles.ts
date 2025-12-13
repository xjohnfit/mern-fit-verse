import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    alignItems: 'center',
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  containerDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B98120',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleLight: {
    color: '#111827',
  },
  titleDark: {
    color: '#D1D5DB',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  descriptionLight: {
    color: '#6B7280',
  },
  descriptionDark: {
    color: '#9CA3AF',
  },
  suggestionsContainer: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  suggestionChipLight: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  suggestionChipDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  suggestionTextLight: {
    color: '#6B7280',
  },
  suggestionTextDark: {
    color: '#D1D5DB',
  },
});

export default styles;

