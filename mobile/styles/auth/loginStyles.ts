import { StyleSheet } from 'react-native';

const LoginStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingVertical: 20,
        },
        headerContainer: {
            marginBottom: 24,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 8,
        },
        headerSubtitle: {
            fontSize: 15,
            color: '#bfdbfe',
        },
        formContainer: {
            gap: 16,
        },
        fieldContainer: {
            marginBottom: 16,
        },
        fieldLabel: {
            fontSize: 13,
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: 8,
        },
        textInput: {
            height: 48,
            width: '100%',
            paddingHorizontal: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 12,
            color: '#ffffff',
            fontSize: 15,
        },
        passwordContainer: {
            position: 'relative',
        },
        passwordInput: {
            height: 48,
            width: '100%',
            paddingHorizontal: 16,
            paddingRight: 50,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 12,
            color: '#ffffff',
            fontSize: 15,
        },
        passwordToggle: {
            position: 'absolute',
            right: 12,
            top: 12,
        },
        rememberForgotRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        rememberMeContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
        },
        checkbox: {
            width: 20,
            height: 20,
            borderWidth: 2,
            borderRadius: 4,
            marginRight: 12,
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
        rememberText: {
            fontSize: 14,
            color: '#ffffff',
        },
        forgotButton: {
            paddingVertical: 8,
        },
        forgotText: {
            fontSize: 14,
            color: '#ffffff',
            fontWeight: '500',
        },
        submitButton: {
            width: '100%',
            paddingVertical: 14,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
            marginBottom: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        submitButtonActive: {
            backgroundColor: '#ffffff',
        },
        submitButtonDisabled: {
            backgroundColor: '#9ca3af',
        },
        submitButtonText: {
            color: '#2563eb',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: 18,
        },
        dividerContainer: {
            marginVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
        },
        dividerLine: {
            flex: 1,
            height: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
        dividerText: {
            marginHorizontal: 20,
            color: '#ffffff',
            fontSize: 14,
        },
        socialButtonsRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 20,
        },
        socialButton: {
            flex: 1,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: 12,
        },
        socialButtonLeft: {
            marginRight: 12,
        },
        socialButtonRight: {
            marginLeft: 12,
        },
        socialButtonText: {
            textAlign: 'center',
            color: '#ffffff',
            fontWeight: '500',
        },
        registerLinkContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 8,
        },
        registerText: {
            color: '#bfdbfe',
            fontSize: 16,
        },
        registerLink: {
            color: '#ffffff',
            fontWeight: '600',
            fontSize: 16,
        },
    });

export default LoginStyles;
