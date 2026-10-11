import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Emit a self-contained production build at .next/standalone (server.js +
  // only the traced node_modules). This is what the Docker runtime stage runs.
  output: "standalone",

  // Gzip-compress rendered HTML and static assets served by the Next.js server.
  compress: true,

  // ---------------------------------------------------------------------------
  // Dev performance: redirect the .next build cache to a local temp folder.
  //
  // When the project lives on a network drive (e.g. accessed via Tailscale /
  // SMB), Turbopack writes thousands of tiny cache files to .next/dev on every
  // compile. Over a network FS this causes 20-60s hot-reload times.
  //
  // Next.js always resolves distDir relative to the project root — absolute
  // paths and cross-drive paths do not work on Windows. The solution is to set
  // NEXT_DIST_DIR in .env.local to a relative path that escapes the project,
  // e.g. "../../.next-centerport-dev" which lands on the same drive as the
  // project but outside the repo, or point it at a local junction/symlink.
  //
  // If NEXT_DIST_DIR is not set, falls back to the normal ".next" directory.
  // Production builds always use ".next" regardless.
  // ---------------------------------------------------------------------------
  distDir: process.env.NODE_ENV === "production"
    ? ".next"
    : (process.env.NEXT_DIST_DIR ?? ".next"),

  turbopack: {
    // Pin the project root to this frontend directory. Without this, a stray
    // lockfile in a parent directory can make Turbopack infer the wrong root,
    // which breaks module resolution (e.g. the React Client Manifest failing
    // to find Next's built-in global-error component).
    root: path.join(__dirname),
  },
};

export default nextConfig;
