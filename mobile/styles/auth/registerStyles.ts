import { StyleSheet } from 'react-native';

const RegisterStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 24,
            paddingVertical: 48,
        },
        headerContainer: {
            alignItems: 'center',
            marginBottom: 32,
        },
        headerTitle: {
            fontSize: 36,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 8,
        },
        headerSubtitle: {
            fontSize: 18,
            color: '#bfdbfe',
        },
        formContainer: {
            gap: 16,
        },
        fieldContainer: {
            marginBottom: 16,
        },
        fieldLabel: {
            fontSize: 14,
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: 8,
        },
        textInput: {
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 12,
            color: '#ffffff',
            fontSize: 16,
        },
        passwordContainer: {
            position: 'relative',
        },
        passwordInput: {
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 12,
            paddingRight: 56,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 12,
            color: '#ffffff',
            fontSize: 16,
        },
        passwordToggle: {
            position: 'absolute',
            right: 16,
            top: 12,
        },
        passwordStrengthText: {
            fontSize: 12,
            marginTop: 4,
            color: '#ffffff',
        },
        dobButton: {
            width: '100%',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 12,
        },
        dobButtonText: {
            fontSize: 16,
            color: '#ffffff',
        },
        genderRow: {
            flexDirection: 'row',
            gap: 8,
        },
        genderButton: {
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 1,
        },
        genderButtonActive: {
            backgroundColor: '#ffffff',
            borderColor: '#ffffff',
        },
        genderButtonInactive: {
            backgroundColor: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        genderButtonText: {
            textAlign: 'center',
            textTransform: 'capitalize',
            fontSize: 16,
        },
        genderButtonTextActive: {
            color: '#2563eb',
            fontWeight: '600',
        },
        genderButtonTextInactive: {
            color: '#ffffff',
            fontWeight: 'normal',
        },
        termsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
        },
        checkbox: {
            width: 20,
            height: 20,
            borderWidth: 2,
            borderRadius: 4,
            marginRight: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },
        checkboxChecked: {
            backgroundColor: '#ffffff',
            borderColor: '#ffffff',
        },
        checkboxUnchecked: {
            backgroundColor: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        termsText: {
            fontSize: 14,
            color: '#ffffff',
        },
        termsLink: {
            fontWeight: '600',
        },
        submitButton: {
            width: '100%',
            paddingVertical: 16,
            borderRadius: 12,
            marginTop: 24,
            alignItems: 'center',
            justifyContent: 'center',
        },
        submitButtonActive: {
            backgroundColor: '#ffffff',
        },
        submitButtonDisabled: {
            backgroundColor: '#ffffff',
            opacity: 0.7,
        },
        submitButtonText: {
            color: '#2563eb',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: 18,
        },
        loginLinkContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 32,
        },
        loginText: {
            color: '#bfdbfe',
            fontSize: 16,
        },
        loginLink: {
            color: '#ffffff',
            fontWeight: '600',
            fontSize: 16,
        },
    });

export default RegisterStyles;
