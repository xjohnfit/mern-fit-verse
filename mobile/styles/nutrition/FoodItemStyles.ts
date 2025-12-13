import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  itemContainerLight: {
    backgroundColor: '#F9FAFB',
  },
  itemContainerDark: {
    backgroundColor: '#111827',
  },
  contentContainer: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  foodNameLight: {
    color: '#111827',
  },
  foodNameDark: {
    color: '#FFFFFF',
  },
  macrosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroText: {
    fontSize: 12,
    marginLeft: 3,
    fontWeight: '600',
  },
  macroTextLight: {
    color: '#6B7280',
  },
  macroTextDark: {
    color: '#9CA3AF',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EF444420',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default styles;

