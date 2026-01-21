"use client";

import { ReactNode } from "react";
import Scissor from "@/assets/scissor.svg";

type AccountTab = "dashboard" | "order-history" | "points-activity" | "account-details";

type AccountLayoutProps = {
  activeTab: AccountTab;
  onTabChange: (tab: AccountTab) => void;
  onLogout: () => void;
  children: ReactNode;
};

export default function AccountLayout({
  activeTab,
  onTabChange,
  onLogout,
  children,
}: AccountLayoutProps) {
  const tabs: { id: AccountTab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "order-history", label: "Order History" },
    { id: "points-activity", label: "Points Activity" },
    { id: "account-details", label: "Account Details" },
  ];

  return (
    <main style={{ viewTransitionName: "main-content" }}>
      {/* Header */}
      <section className="flex flex-wrap items-center justify-between gap-6 px-6 pt-12 md:pt-20">
        <h1 className="font-price-check text-3xl font-stretch-expanded md:text-6xl">
          My Account
        </h1>
        <button
          onClick={onLogout}
          className="font-ultra-bold cursor-pointer font-family-trade-gothic text-lg font-extrabold uppercase"
        >
          Logout
        </button>
      </section>

      {/* Main Content */}
      <section className="flex gap-6 px-6 py-10 max-md:flex-col md:py-12">
        {/* Sidebar */}
        <div className="relative w-full md:w-[350px]">
          <div className="flex flex-col space-y-5 rounded-xl border-2 border-dashed p-6 font-family-trade-gothic sm:text-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`cursor-pointer text-left font-ultra-bold uppercase ${
                  activeTab === tab.id ? "text-pop-red-accent" : ""
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="absolute -top-3 right-2">
            <Scissor />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col gap-12">
          {children}
        </div>
      </section>
    </main>
  );
}
