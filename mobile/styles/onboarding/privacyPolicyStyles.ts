import { StyleSheet } from 'react-native';

const privacyPolicyStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    lightBackground: {
        backgroundColor: '#F9FAFB',
    },
    darkBackground: {
        backgroundColor: '#111827',
    },

    // Header Styles
    header: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    headerLight: {
        backgroundColor: '#FFFFFF',
        borderBottomColor: '#E5E7EB',
    },
    headerDark: {
        backgroundColor: '#1F2937',
        borderBottomColor: '#374151',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
        padding: 8,
        marginLeft: -8,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerTitleLight: {
        color: '#111827',
    },
    headerTitleDark: {
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    headerSubtitleLight: {
        color: '#6B7280',
    },
    headerSubtitleDark: {
        color: '#9CA3AF',
    },

    // ScrollView
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    // Notice Banner
    noticeBanner: {
        borderWidth: 2,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    noticeBannerLight: {
        backgroundColor: '#ECFDF5',
        borderColor: '#A7F3D0',
    },
    noticeBannerDark: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: '#065F46',
    },
    noticeBannerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    noticeIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    noticeIconContainerLight: {
        backgroundColor: '#D1FAE5',
    },
    noticeIconContainerDark: {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
    },
    noticeTextContainer: {
        flex: 1,
    },
    noticeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    noticeTitleLight: {
        color: '#065F46',
    },
    noticeTitleDark: {
        color: '#A7F3D0',
    },
    noticeText: {
        fontSize: 14,
        lineHeight: 20,
    },
    noticeTextLight: {
        color: '#047857',
    },
    noticeTextDark: {
        color: '#6EE7B7',
    },

    // Section Styles
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionIcon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    sectionTitleLight: {
        color: '#111827',
    },
    sectionTitleDark: {
        color: '#F9FAFB',
    },

    // Subsection Styles
    subsectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 8,
    },
    subsectionTitleLight: {
        color: '#1F2937',
    },
    subsectionTitleDark: {
        color: '#E5E7EB',
    },

    // Body Text
    bodyText: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 12,
    },
    bodyTextLight: {
        color: '#4B5563',
    },
    bodyTextDark: {
        color: '#D1D5DB',
    },

    // Link Styles
    linkText: {
        fontSize: 14,
        color: '#3B82F6',
        marginTop: 8,
        marginBottom: 12,
    },

    // Contact Button
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginTop: 12,
    },
    contactButtonText: {
        fontSize: 15,
        fontWeight: '500',
    },
    contactButtonTextLight: {
        color: '#111827',
    },
    contactButtonTextDark: {
        color: '#F9FAFB',
    },
});

export default privacyPolicyStyles;

