import { StyleSheet } from 'react-native';

const EULAStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lightBackground: {
        backgroundColor: '#FAFAFA',
    },
    darkBackground: {
        backgroundColor: '#0A0A0A',
    },

    // Header Styles
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 20,
        borderBottomWidth: 2,
    },
    headerLight: {
        backgroundColor: '#FFFFFF',
        borderBottomColor: '#E0E0E0',
    },
    headerDark: {
        backgroundColor: '#1A1A1A',
        borderBottomColor: '#2A2A2A',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonLight: {
        backgroundColor: '#F5F5F5',
    },
    backButtonDark: {
        backgroundColor: '#2A2A2A',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    headerTitleLight: {
        color: '#1A1A1A',
    },
    headerTitleDark: {
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    headerSubtitleLight: {
        color: '#757575',
    },
    headerSubtitleDark: {
        color: '#A0A0A0',
    },

    // ScrollView
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    // Notice Banner
    noticeBanner: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    noticeBannerLight: {
        backgroundColor: '#FFF3E0',
        borderWidth: 1,
        borderColor: '#FFB74D',
    },
    noticeBannerDark: {
        backgroundColor: 'rgba(255, 183, 77, 0.15)',
        borderWidth: 1,
        borderColor: '#D84315',
    },
    noticeBannerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    noticeIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noticeIconContainerLight: {
        backgroundColor: '#FFE0B2',
    },
    noticeIconContainerDark: {
        backgroundColor: 'rgba(255, 183, 77, 0.25)',
    },
    noticeTextContainer: {
        flex: 1,
    },
    noticeTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    noticeTitleLight: {
        color: '#E65100',
    },
    noticeTitleDark: {
        color: '#FFB74D',
    },
    noticeText: {
        fontSize: 13,
        lineHeight: 20,
        fontWeight: '500',
    },
    noticeTextLight: {
        color: '#5D4037',
    },
    noticeTextDark: {
        color: '#FFCC80',
    },

    // Section Styles
    section: {
        marginBottom: 28,
        borderRadius: 16,
        padding: 20,
    },
    sectionLight: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionDark: {
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 2,
    },
    sectionHeaderBorderLight: {
        borderBottomColor: '#F5F5F5',
    },
    sectionHeaderBorderDark: {
        borderBottomColor: '#2A2A2A',
    },
    sectionIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        flex: 1,
        letterSpacing: 0.3,
    },
    sectionTitleLight: {
        color: '#212121',
    },
    sectionTitleDark: {
        color: '#F5F5F5',
    },
    bodyText: {
        fontSize: 14,
        lineHeight: 22,
        fontWeight: '400',
    },
    bodyTextLight: {
        color: '#424242',
    },
    bodyTextDark: {
        color: '#BDBDBD',
    },

    // Color-coded section icons
    greenIconBg: {
        backgroundColor: '#E8F5E9',
    },
    greenIconBgDark: {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
    },
    redIconBg: {
        backgroundColor: '#FFEBEE',
    },
    redIconBgDark: {
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
    },
    orangeIconBg: {
        backgroundColor: '#FFF3E0',
    },
    orangeIconBgDark: {
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
    },
    purpleIconBg: {
        backgroundColor: '#F3E5F5',
    },
    purpleIconBgDark: {
        backgroundColor: 'rgba(156, 39, 176, 0.2)',
    },
    pinkIconBg: {
        backgroundColor: '#FCE4EC',
    },
    pinkIconBgDark: {
        backgroundColor: 'rgba(233, 30, 99, 0.2)',
    },
    cyanIconBg: {
        backgroundColor: '#E0F7FA',
    },
    cyanIconBgDark: {
        backgroundColor: 'rgba(0, 188, 212, 0.2)',
    },
    blueIconBg: {
        backgroundColor: '#E3F2FD',
    },
    blueIconBgDark: {
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
    },
    tealIconBg: {
        backgroundColor: '#E0F2F1',
    },
    tealIconBgDark: {
        backgroundColor: 'rgba(0, 150, 136, 0.2)',
    },

    // Emphasized text styles
    emphasizedText: {
        fontWeight: '700',
    },
    dangerText: {
        color: '#D32F2F',
    },
    dangerTextDark: {
        color: '#EF5350',
    },
    linkText: {
        color: '#1976D2',
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
    linkTextDark: {
        color: '#64B5F6',
    },

    // List styles
    bulletPoint: {
        marginLeft: 8,
        marginVertical: 4,
    },
    bulletText: {
        fontSize: 14,
        lineHeight: 22,
    },

    // Footer
    footer: {
        borderRadius: 16,
        padding: 20,
        marginTop: 12,
        marginBottom: 32,
        alignItems: 'center',
    },
    footerLight: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    footerDark: {
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    footerText: {
        fontSize: 12,
        marginVertical: 4,
        fontWeight: '500',
        textAlign: 'center',
    },
    footerTextLight: {
        color: '#616161',
    },
    footerTextDark: {
        color: '#9E9E9E',
    },
    footerEmoji: {
        fontSize: 20,
        marginBottom: 8,
    },
});

export default EULAStyles;
