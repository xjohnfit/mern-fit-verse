export const getPasswordStrength = (password: string) => {
    let strength = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[@$!%*?&]/.test(password),
    };

    strength = Object.values(checks).filter(Boolean).length;

    if (strength === 0) return { score: 0, text: '', color: '' };
    if (strength <= 2) return { score: 1, text: 'Weak', color: 'bg-red-500' };
    if (strength <= 3)
        return { score: 2, text: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { score: 3, text: 'Good', color: 'bg-blue-500' };
    return { score: 4, text: 'Strong', color: 'bg-green-500' };
};
