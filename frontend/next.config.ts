import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      // Silence the inferred root warning by pinning the root
      root: "/Users/jason/OnlineShoppingSystem/frontend",
    },
  },
};

export default nextConfig;
