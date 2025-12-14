import { StyleSheet } from 'react-native';

const dashboardStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    containerDark: {
        flex: 1,
        backgroundColor: '#111827',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 24,
        paddingHorizontal: 8,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    sectionTitleDark: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    macrosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    macroItem: {
        alignItems: 'center',
    },
    macroValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    macroLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        marginTop: 4,
    },
    macroGoal: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        gap: 8,
    },
    statsCard: {
        flex: 1,
    },
    bottomSpacer: {
        height: 32,
    },
});

export default dashboardStyles;
