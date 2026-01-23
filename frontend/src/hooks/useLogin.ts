import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { login, setToken, setRefreshToken, type LoginData } from "@/lib/api/auth";

/**
 * Hook for handling login form logic
 */
export function useLogin(prefilledUsername: string = "", onSuccess?: () => void, redirect?: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState<LoginData>({
    username: prefilledUsername,
    password: "",
  });
  const [loginError, setLoginError] = useState<string>("");

  // Update username when prefilledUsername changes
  useEffect(() => {
    if (prefilledUsername) {
      setLoginData({ username: prefilledUsername, password: "" });
    }
  }, [prefilledUsername]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      const response = await login(loginData);
      setToken(response.token);
      setRefreshToken(response.refresh_token);
      toast.success("Login successful!");

      if (onSuccess) {
        onSuccess();
      } else {
        // Check if there's a checkout intent stored
        const checkoutIntent = typeof window !== "undefined" ? sessionStorage.getItem("checkout_intent") : null;
        if (checkoutIntent === "true") {
          // Clear the intent and redirect to home (user can open cart and checkout)
          sessionStorage.removeItem("checkout_intent");
          window.location.href = redirect || "/";
        } else if (redirect) {
          // Redirect to the specified path
          window.location.href = redirect;
        } else {
          // Redirect to protected page or home
          window.location.href = "/account";
        }
      }
    } catch (error) {
      const apiError = error as { error?: string; username?: string[]; password?: string[] };
      const errorMessage = apiError.error || apiError.username?.[0] || apiError.password?.[0] || "Login failed";
      setLoginError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginData,
    setLoginData,
    loginError,
    isLoading,
    handleLogin,
  };
}
