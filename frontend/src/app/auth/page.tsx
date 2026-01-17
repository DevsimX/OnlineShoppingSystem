"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Marquee from "@/components/home/Marquee";
import LoginForm from "./_components/LoginForm";
import RegisterForm from "./_components/RegisterForm";

type TabType = "login" | "register";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [prefilledUsername, setPrefilledUsername] = useState<string>("");

  const handleRegisterSuccess = (username: string) => {
    setActiveTab("login");
    setPrefilledUsername(username);
  };

  return (
    <>
      <main style={{ viewTransitionName: "main-content" }}>
        <div className="mx-auto max-w-5xl px-3 py-12 md:py-24">
          <div className="grid rounded-2xl border-2 from-[var(--pop-yellow-mid)] from-50% to-[var(--pop-red-mid)] to-50% shadow-3d max-md:bg-gradient-to-b md:grid-cols-2 md:bg-gradient-to-r">
            {/* Left side - Auth Form */}
            <div className="space-y-8 bg-[var(--pop-yellow-mid)] px-3 py-6 max-md:rounded-t-2xl max-md:border-b-2 md:rounded-l-2xl md:border-r-2 md:p-12">
              <div className="space-y-4 text-center">
                <h1 className="font-reika-script text-4xl md:text-6xl">Log In or Join POP</h1>
                <p className="text-xl font-semibold">
                  Whether you have an account or not, join our community of local makers and shoppers.
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex gap-4 border-b-2 border-black">
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-2 text-lg font-semibold transition-colors ${
                    activeTab === "login"
                      ? "border-b-4 border-black text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className={`flex-1 py-2 text-lg font-semibold transition-colors ${
                    activeTab === "register"
                      ? "border-b-4 border-black text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Register
                </button>
              </div>

              {/* Login Form */}
              {activeTab === "login" && <LoginForm prefilledUsername={prefilledUsername} />}

              {/* Register Form */}
              {activeTab === "register" && (
                <RegisterForm onSuccess={handleRegisterSuccess} />
              )}
            </div>

            {/* Right side - Why Join POP */}
            <div className="flex flex-col items-center justify-center gap-6 bg-[var(--pop-red-mid)] p-6 text-center max-md:rounded-b-2xl md:rounded-r-2xl md:p-12">
              <Image
                src="https://cdn.sanity.io/images/q52u2xck/production/791a53180e1c188afd55fad355a1297ecff51163-159x160.svg?w=120&auto=format"
                alt="Why Join POP?"
                width={120}
                height={120}
                className="h-auto w-32"
                unoptimized
              />
              <h2 className="font-price-check text-3xl text-[var(--pop-yellow-light)] font-stretch-expanded md:text-4xl">
                Why Join POP?
              </h2>
              <p className="text-lg text-[var(--pop-yellow-light)]">
                Earn POP Points when you shop online or in-store. Unlock exclusive discounts,
                offers, and local perks.
              </p>
              <div>
                <Link
                  href="/loyalty"
                  className="text-lg text-[var(--pop-yellow-light)] underline underline-offset-2"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Marquee />
    </>
  );
}
