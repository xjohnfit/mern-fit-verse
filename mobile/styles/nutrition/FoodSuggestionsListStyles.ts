import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  headerTextLight: {
    color: '#6B7280',
  },
  headerTextDark: {
    color: '#9CA3AF',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionItemLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  suggestionItemDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#10B98120',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 15,
    flex: 1,
    fontWeight: '500',
  },
  suggestionTextLight: {
    color: '#111827',
  },
  suggestionTextDark: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
  },
  loadingTextLight: {
    color: '#6B7280',
  },
  loadingTextDark: {
    color: '#9CA3AF',
  },
});

export default styles;

