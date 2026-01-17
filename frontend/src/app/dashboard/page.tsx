"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, isLoading, handleLogout } = useAuth();

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
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-reika-script text-4xl md:text-6xl">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-[var(--pop-red-accent)] text-white rounded-full border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[var(--pop-teal-mid)]"
          >
            Logout
          </button>
        </div>
        <div className="space-y-4">
          <p className="text-xl">Welcome, {user.first_name || user.username}!</p>
          <p className="text-lg">Email: {user.email}</p>
          <p className="text-lg">Username: {user.username}</p>
        </div>
      </div>
    </main>
  );
}
