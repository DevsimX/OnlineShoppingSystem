"use client";

import Link from "next/link";
import { useState } from "react";
import Marquee from "@/components/home/Marquee";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  const isValidEmail = emailPattern.test(email);
  const showError = hasInteracted && email.length > 0 && !isValidEmail;

  return (
    <>
      <main style={{ viewTransitionName: "main-content" }}>
        <div className="mx-auto max-w-5xl px-3 py-12 md:py-24">
          <div className="grid rounded-2xl border-2 from-[var(--pop-yellow-mid)] from-50% to-[var(--pop-red-mid)] to-50% shadow-3d max-md:bg-gradient-to-b md:grid-cols-2 md:bg-gradient-to-r">
            {/* Left side - Login Form */}
            <div className="space-y-8 bg-[var(--pop-yellow-mid)] px-3 py-6 max-md:rounded-t-2xl max-md:border-b-2 md:rounded-l-2xl md:border-r-2 md:p-12">
              <div className="space-y-4 text-center">
                <h1 className="font-reika-script text-4xl md:text-6xl">Log In or Join POP</h1>
                <p className="text-xl font-semibold">
                  Whether you have an account or not, enter your email to receive a one-time passcode.
                </p>
              </div>

              <form method="post" className="space-y-6" action="?/sendOtp">
                <div className="space-y-4">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setHasInteracted(true);
                    }}
                    onBlur={() => setHasInteracted(true)}
                    className={`w-full bg-white rounded-full border-2 px-4 py-2 shadow-3d focus:ring-0 focus:outline-none transition-colors ${showError
                        ? "border-red-500 focus:border-red-500"
                        : "border-[var(--pop-neutral-black)] focus:border-[var(--pop-neutral-black)]"
                      }`}
                  />
                  {showError && (
                    <p className="text-sm text-red-600 px-4">Please enter a valid email address</p>
                  )}
                </div>

                <div className="">
                  {/* Cloudflare Turnstile placeholder - leave blank */}
                  <div className="svelte-1gvfki5 flexible">
                    <div>
                      {/* Cloudflare Turnstile widget placeholder */}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    className="flex items-center justify-center uppercase tracking-wide font-black disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer leading-none bg-[var(--pop-red-accent)] text-white hover:bg-[var(--pop-teal-mid)] border-2 border-black shadow-[2px_2px_0px_0px_#000] min-h-12 px-6 py-2 text-lg md:text-xl rounded-full w-full"
                    type="submit"
                    disabled={!isValidEmail}
                  >
                    Send code
                  </button>
                </div>
              </form>
            </div>

            {/* Right side - Why Join POP */}
            <div className="flex flex-col items-center justify-center gap-6 bg-[var(--pop-red-mid)] p-6 text-center max-md:rounded-b-2xl md:rounded-r-2xl md:p-12">
              <img
                decoding="async"
                src="https://cdn.sanity.io/images/q52u2xck/production/791a53180e1c188afd55fad355a1297ecff51163-159x160.svg?w=120&auto=format"
                alt="Why Join POP?"
                className="h-auto w-32"
                width="120"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              <h2 className="font-price-check text-3xl text-[var(--pop-yellow-light)] font-stretch-expanded md:text-4xl">
                Why Join POP?
              </h2>
              <p className="text-lg text-[var(--pop-yellow-light)]">
                Earn POP Points when you shop online or in-store. Unlock exclusive discounts, offers, and local perks.
              </p>
              <div>
                <Link href="/loyalty" className="text-lg text-[var(--pop-yellow-light)] underline underline-offset-2">
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
