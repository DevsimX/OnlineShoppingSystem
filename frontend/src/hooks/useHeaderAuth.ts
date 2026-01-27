import { useEffect, useState } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { isAuthenticated } from "@/lib/api/auth";

export function useHeaderAuth(router: AppRouterInstance) {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);

  // Check authentication status after hydration to avoid SSR mismatch
  useEffect(() => {
    setIsAuthenticatedState(isAuthenticated());

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token") {
        setIsAuthenticatedState(isAuthenticated());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const accountHref = isAuthenticatedState ? "/account" : "/auth";

  const handleAccountClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(accountHref);
  };

  return {
    isAuthenticated: isAuthenticatedState,
    accountHref,
    handleAccountClick,
  };
}

