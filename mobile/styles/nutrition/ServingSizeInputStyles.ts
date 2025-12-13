import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
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
    marginBottom: 12,
  },
  headerText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  headerTextLight: {
    color: '#111827',
  },
  headerTextDark: {
    color: '#D1D5DB',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 2,
    marginRight: 12,
  },
  inputLight: {
    backgroundColor: '#F3F4F6',
    color: '#111827',
  },
  inputDark: {
    backgroundColor: '#374151',
    color: '#FFFFFF',
  },
  inputActive: {
    borderColor: '#10B981',
  },
  inputInactive: {
    borderColor: 'transparent',
  },
  unitContainer: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  unitContainerLight: {
    backgroundColor: '#F3F4F6',
  },
  unitContainerDark: {
    backgroundColor: '#374151',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  unitTextLight: {
    color: '#6B7280',
  },
  unitTextDark: {
    color: '#9CA3AF',
  },
});

export default styles;

