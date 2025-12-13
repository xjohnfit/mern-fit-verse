import { StyleSheet } from 'react-native';

const deleteAccountStyles = StyleSheet.create({
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
    gradientHeader: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
        elevation: 4,
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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
    gradientHeaderTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },

    // ScrollView
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
    },

    // Warning Banner
    warningBanner: {
        borderWidth: 2,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    warningBannerLight: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
    },
    warningBannerDark: {
        backgroundColor: 'rgba(127, 29, 29, 0.2)',
        borderColor: '#991B1B',
    },
    warningBannerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    warningIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    warningIconContainerLight: {
        backgroundColor: '#FEE2E2',
    },
    warningIconContainerDark: {
        backgroundColor: 'rgba(127, 29, 29, 0.4)',
    },
    warningTextContainer: {
        flex: 1,
    },
    warningTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    warningTitleLight: {
        color: '#7F1D1D',
    },
    warningTitleDark: {
        color: '#FEE2E2',
    },
    warningSubtext: {
        fontSize: 14,
    },
    warningSubtextLight: {
        color: '#B91C1C',
    },
    warningSubtextDark: {
        color: '#FCA5A5',
    },

    // Card Container
    card: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    cardLight: {
        backgroundColor: '#FFFFFF',
    },
    cardDark: {
        backgroundColor: '#1F2937',
    },

    // Card Header
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    redIconContainerLight: {
        backgroundColor: '#FEE2E2',
    },
    redIconContainerDark: {
        backgroundColor: 'rgba(127, 29, 29, 0.3)',
    },
    orangeIconContainerLight: {
        backgroundColor: '#FFEDD5',
    },
    orangeIconContainerDark: {
        backgroundColor: 'rgba(124, 45, 18, 0.3)',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardTitleLight: {
        color: '#111827',
    },
    cardTitleDark: {
        color: '#FFFFFF',
    },

    // What Will Be Deleted Section
    deletionWarningText: {
        fontSize: 14,
        marginBottom: 16,
    },
    deletionWarningTextLight: {
        color: '#B91C1C',
    },
    deletionWarningTextDark: {
        color: '#FCA5A5',
    },

    // List Items
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    listIconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    listIconContainerLight: {
        backgroundColor: '#FEE2E2',
    },
    listIconContainerDark: {
        backgroundColor: 'rgba(127, 29, 29, 0.3)',
    },
    listItemText: {
        flex: 1,
        fontSize: 14,
    },
    listItemTextLight: {
        color: '#374151',
    },
    listItemTextDark: {
        color: '#D1D5DB',
    },

    // Confirmation Section
    confirmationText: {
        fontSize: 14,
        marginBottom: 16,
    },
    confirmationTextLight: {
        color: '#4B5563',
    },
    confirmationTextDark: {
        color: '#9CA3AF',
    },
    confirmationBold: {
        fontWeight: 'bold',
    },
    confirmationBoldLight: {
        color: '#DC2626',
    },
    confirmationBoldDark: {
        color: '#F87171',
    },

    // Text Input
    textInput: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderWidth: 2,
        borderRadius: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    textInputLight: {
        backgroundColor: '#F9FAFB',
        borderColor: '#D1D5DB',
        color: '#111827',
    },
    textInputDark: {
        backgroundColor: '#374151',
        borderColor: '#4B5563',
        color: '#FFFFFF',
    },
    textInputFocused: {
        borderColor: '#DC2626',
    },

    // Buttons
    buttonContainer: {
        marginBottom: 24,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginBottom: 12,
    },
    deleteButton: {
        backgroundColor: '#DC2626',
    },
    deleteButtonDisabled: {
        backgroundColor: '#D1D5DB',
        shadowOpacity: 0,
        elevation: 0,
    },
    deleteButtonDisabledDark: {
        backgroundColor: '#374151',
    },
    cancelButton: {
        shadowOpacity: 0,
        elevation: 0,
    },
    cancelButtonLight: {
        backgroundColor: '#E5E7EB',
    },
    cancelButtonDark: {
        backgroundColor: '#374151',
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTextWhite: {
        color: '#FFFFFF',
    },
    buttonTextLight: {
        color: '#111827',
    },
    buttonTextDark: {
        color: '#FFFFFF',
    },

    // Info Box
    infoBox: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 32,
    },
    infoBoxLight: {
        backgroundColor: '#FFFBEB',
        borderColor: '#FED7AA',
    },
    infoBoxDark: {
        backgroundColor: 'rgba(124, 45, 18, 0.1)',
        borderColor: '#9A3412',
    },
    infoBoxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoBoxText: {
        flex: 1,
        fontSize: 12,
    },
    infoBoxTextLight: {
        color: '#C2410C',
    },
    infoBoxTextDark: {
        color: '#FDBA74',
    },
    infoIcon: {
        marginTop: 2,
        marginRight: 8,
    },
});

export default deleteAccountStyles;