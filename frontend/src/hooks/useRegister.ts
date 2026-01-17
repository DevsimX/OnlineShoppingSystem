import { useState } from "react";
import { toast } from "react-hot-toast";
import { register, type RegisterData } from "@/lib/api/auth";
import { usePasswordValidation } from "./usePasswordValidation";

/**
 * Hook for handling registration form logic
 */
export function useRegister(onSuccess?: (username: string) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
  });

  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});
  const [hasInteracted, setHasInteracted] = useState<Record<string, boolean>>({});

  // Password validation
  const {
    isStrongPassword,
    passwordRequirements,
    getPasswordStrengthLabel,
    getPasswordStrengthColor,
  } = usePasswordValidation(registerData.password);

  // Validation helpers
  const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = registerData.email ? emailPattern.test(registerData.email) : true;
  const passwordsMatch = registerData.password === registerData.password_confirm || !registerData.password_confirm;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterErrors({});

    // Client-side validation - Password strength
    if (!isStrongPassword) {
      setRegisterErrors({ password: "Password does not meet strength requirements" });
      toast.error("Please create a stronger password");
      return;
    }

    // Client-side validation - Password match
    if (registerData.password !== registerData.password_confirm) {
      setRegisterErrors({ password_confirm: "Passwords do not match" });
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await register(registerData);
      toast.success("Registration successful! Please login.");

      if (onSuccess) {
        onSuccess(registerData.username);
      }
    } catch (error) {
      const apiError = error as Record<string, string | string[]>;
      const errors: Record<string, string> = {};
      Object.keys(apiError).forEach((key) => {
        if (Array.isArray(apiError[key])) {
          errors[key] = (apiError[key] as string[])[0];
        } else {
          errors[key] = apiError[key] as string;
        }
      });
      setRegisterErrors(errors);
      toast.error("Registration failed. Please check the errors.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerData,
    setRegisterData,
    registerErrors,
    hasInteracted,
    setHasInteracted,
    isLoading,
    isValidEmail,
    passwordsMatch,
    isStrongPassword,
    passwordRequirements,
    getPasswordStrengthLabel,
    getPasswordStrengthColor,
    handleRegister,
  };
}
