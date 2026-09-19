import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Gzip-compress rendered HTML and static assets served by the Next.js server.
  compress: true,

  turbopack: {
    // Pin the project root to this frontend directory. Without this, a stray
    // lockfile in a parent directory can make Turbopack infer the wrong root,
    // which breaks module resolution (e.g. the React Client Manifest failing
    // to find Next's built-in global-error component).
    root: path.join(__dirname),
  },
};

export default nextConfig;
