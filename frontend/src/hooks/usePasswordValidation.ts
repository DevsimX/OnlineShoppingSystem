/**
 * Hook for password strength validation
 */
export function usePasswordValidation(password: string) {
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passwordStrength = Object.values(passwordRequirements).filter(Boolean).length;
  const isStrongPassword = Object.values(passwordRequirements).every(Boolean);

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return "Very Weak";
    if (passwordStrength === 1 || passwordStrength === 2) return "Weak";
    if (passwordStrength === 3) return "Fair";
    if (passwordStrength === 4) return "Good";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "red";
    if (passwordStrength === 3) return "yellow";
    if (passwordStrength === 4) return "blue";
    return "green";
  };

  return {
    passwordRequirements,
    passwordStrength,
    isStrongPassword,
    getPasswordStrengthLabel,
    getPasswordStrengthColor,
  };
}
