import { useState } from "react";

type TabType = "login" | "register";

/**
 * Hook for managing auth page tabs and prefilled username
 */
export function useAuthTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [prefilledUsername, setPrefilledUsername] = useState<string>("");

  const handleRegisterSuccess = (username: string) => {
    setActiveTab("login");
    setPrefilledUsername(username);
  };

  return {
    activeTab,
    setActiveTab,
    prefilledUsername,
    handleRegisterSuccess,
  };
}
