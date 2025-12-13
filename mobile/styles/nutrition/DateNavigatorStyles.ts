import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
  },
  containerDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonLight: {
    backgroundColor: '#F3F4F6',
  },
  navButtonDark: {
    backgroundColor: '#374151',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 17,
    fontWeight: '700',
  },
  dateTextLight: {
    color: '#111827',
  },
  dateTextDark: {
    color: '#FFFFFF',
  },
});

export default styles;

