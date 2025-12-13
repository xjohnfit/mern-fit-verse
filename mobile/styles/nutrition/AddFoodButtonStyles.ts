import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  buttonActive: {
    backgroundColor: '#10B981',
    shadowOpacity: 0.3,
    elevation: 5,
  },
  buttonDisabledLight: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonDisabledDark: {
    backgroundColor: '#374151',
    shadowOpacity: 0,
    elevation: 0,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default styles;

