import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
        },
        modalContainer: {
            height: SCREEN_HEIGHT * 0.9,
            backgroundColor: isDark ? '#111827' : '#F9FAFB',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: 'hidden',
        },
        header: {
            paddingTop: 20,
            paddingBottom: 20,
            paddingHorizontal: 20,
        },
        headerContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
        },
        headerTitleContainer: {
            flex: 1,
            marginRight: 12,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: '700',
            color: '#FFFFFF',
            marginBottom: 8,
        },
        categoryBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            alignSelf: 'flex-start',
            gap: 6,
        },
        categoryBadgeText: {
            fontSize: 13,
            fontWeight: '600',
            color: '#FFFFFF',
        },
        closeButton: {
            width: 40,
            height: 40,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            flex: 1,
        },
        contentContainer: {
            paddingBottom: 24,
        },
        imageContainer: {
            width: '100%',
            height: SCREEN_HEIGHT * 0.35,
            position: 'relative',
        },
        exerciseImage: {
            width: '100%',
            height: '100%',
        },
        imageGradient: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
        },
        detailsContainer: {
            padding: 20,
        },
        section: {
            marginBottom: 24,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
            gap: 8,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
        },
        descriptionText: {
            fontSize: 15,
            lineHeight: 24,
            color: isDark ? '#D1D5DB' : '#4B5563',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            padding: 16,
            borderRadius: 12,
        },
        instructionsContainer: {
            gap: 12,
        },
        instructionRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            padding: 16,
            borderRadius: 12,
            gap: 12,
        },
        instructionNumber: {
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: isDark ? '#7e22ce' : '#9333ea',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 2,
        },
        instructionNumberText: {
            fontSize: 14,
            fontWeight: '700',
            color: '#FFFFFF',
        },
        instructionText: {
            flex: 1,
            fontSize: 15,
            lineHeight: 22,
            color: isDark ? '#D1D5DB' : '#4B5563',
        },
        infoGrid: {
            flexDirection: 'row',
            gap: 12,
        },
        infoCard: {
            flex: 1,
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            gap: 8,
        },
        infoLabel: {
            fontSize: 13,
            fontWeight: '500',
            color: isDark ? '#9CA3AF' : '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        infoValue: {
            fontSize: 15,
            fontWeight: '600',
            color: isDark ? '#F9FAFB' : '#111827',
            textAlign: 'center',
        },
    });

export default createStyles;

