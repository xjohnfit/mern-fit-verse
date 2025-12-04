export const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength === 0) return { text: '', color: '' };
    if (strength <= 2) return { text: 'Weak', color: 'text-red-500' };
    if (strength <= 3) return { text: 'Fair', color: 'text-yellow-500' };
    if (strength <= 4) return { text: 'Good', color: 'text-blue-500' };
    return { text: 'Strong', color: 'text-green-500' };
};
