import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static export: this app has no backend, no API routes, and no
  // server-side data fetching (all state lives in the client via
  // localStorage). Static export makes it deployable as plain files —
  // required for a truly offline-capable PWA and for bundling into a
  // Capacitor app locally instead of pointing at a remote URL.
  output: "export",
};

export default nextConfig;
