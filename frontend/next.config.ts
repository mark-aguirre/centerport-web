import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gzip-compress rendered HTML and static assets served by the Next.js server.
  compress: true,
};

export default nextConfig;
