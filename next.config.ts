import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Produces a minimal standalone build — required for Docker
  output: "standalone",
  // Pin workspace root to this project (avoids warning when a parent dir has a lockfile)
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
