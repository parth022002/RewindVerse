import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname, "../../"),
  transpilePackages: [
    "@rewindverse/rvts",
    "@rewindverse/rewindml",
    "@rewindverse/replay-engine",
    "@rewindverse/diagnostics",
  ],
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
