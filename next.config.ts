import type { NextConfig } from "next";

const pythonBackendUrl = process.env.BACKEND_URL ?? "http://localhost:8567";
const insightBackendUrl = process.env.INSIGHT_BACKEND_URL ?? "http://localhost:3001";

const insightApiRewrites = [
  "keywords",
  "hotspots",
  "settings",
  "notifications",
  "check-hotspots",
].flatMap((segment) => [
  {
    source: `/api/${segment}`,
    destination: `${insightBackendUrl}/api/${segment}`,
  },
  {
    source: `/api/${segment}/:path*`,
    destination: `${insightBackendUrl}/api/${segment}/:path*`,
  },
]);

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      ...insightApiRewrites,
      {
        source: "/socket.io/:path*",
        destination: `${insightBackendUrl}/socket.io/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${pythonBackendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
