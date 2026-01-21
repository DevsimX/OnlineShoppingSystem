"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AccountLayout from "./_components/AccountLayout";
import Dashboard from "./_components/Dashboard";
import OrderHistory from "./_components/OrderHistory";
import PointsActivity from "./_components/PointsActivity";
import AccountDetails from "./_components/AccountDetails";

type AccountTab = "dashboard" | "order-history" | "points-activity" | "account-details";

export default function AccountPage() {
  const { user, isLoading, handleLogout } = useAuth();
  const [activeTab, setActiveTab] = useState<AccountTab>("dashboard");

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AccountLayout activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout}>
      {activeTab === "dashboard" && <Dashboard user={user} onTabChange={setActiveTab} />}
      {activeTab === "order-history" && <OrderHistory />}
      {activeTab === "points-activity" && <PointsActivity />}
      {activeTab === "account-details" && <AccountDetails user={user} />}
    </AccountLayout>
  );
}
