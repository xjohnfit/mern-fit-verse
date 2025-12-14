import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerIcon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    sectionTitleDark: {
        fontSize: 18,
        fontWeight: '700',
        color: '#F9FAFB',
    },
    gradient: {
        borderRadius: 16,
        padding: 20,
    },
    calorieContainer: {
        marginBottom: 20,
    },
    calorieHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    calorieLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flameIcon: {
        marginRight: 6,
    },
    calorieLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.9)',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    calorieValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    calorieGoal: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.8)',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
    },
    macrosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    macroItem: {
        flex: 1,
        alignItems: 'center',
    },
    macroIcon: {
        marginBottom: 4,
    },
    macroValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 6,
    },
    macroLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 2,
        fontWeight: '600',
    },
    macroGoal: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
});

export default styles;
