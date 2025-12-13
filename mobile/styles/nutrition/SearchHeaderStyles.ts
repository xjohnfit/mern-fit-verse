import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  containerLight: {
    backgroundColor: '#10b981',
  },
  containerDark: {
    backgroundColor: '#059669',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  backButtonLight: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  backButtonDark: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  titleLight: {
    color: '#FFFFFF',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    color: 'rgba(255,255,255,0.9)',
  },
  subtitleLight: {
    color: 'rgba(255,255,255,0.9)',
  },
  subtitleDark: {
    color: 'rgba(255,255,255,0.9)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainerLight: {
    backgroundColor: '#FFFFFF',
  },
  searchContainerDark: {
    backgroundColor: '#FFFFFF',
  },
  searchContainerActive: {
    borderWidth: 0,
  },
  searchContainerInactive: {
    borderWidth: 0,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827',
  },
  searchInputLight: {
    color: '#111827',
  },
  searchInputDark: {
    color: '#111827',
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  clearButtonLight: {
    backgroundColor: '#F3F4F6',
  },
  clearButtonDark: {
    backgroundColor: '#F3F4F6',
  },
});
export default styles;
