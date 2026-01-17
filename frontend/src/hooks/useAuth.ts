import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getCurrentUser, logout, getRefreshToken, type LoginResponse } from "@/lib/api/auth";

/**
 * Hook for checking authentication status and fetching current user
 * Redirects to /auth if not authenticated
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<LoginResponse["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        router.push("/auth");
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        // Token invalid, redirect to login
        logout(getRefreshToken() || "");
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await logout(getRefreshToken() || "");
    router.push("/auth");
  };

  return { user, isLoading, handleLogout };
}
