"use client";

import Link from "next/link";
import Logo from "@/assets/logo.svg";

export function HeaderLogo() {
  return (
    <div className="relative z-10 transition-all delay-100 max-md:flex-shrink-0">
      <Link href="/">
        <span className="sr-only">Go Home</span>
        <div className="h-auto w-full transition-all max-lg:max-w-[100px] lg:w-[135px] xl:w-[200px]">
          <div className="logo-container">
            <Logo />
          </div>
        </div>
      </Link>
    </div>
  );
}

