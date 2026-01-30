const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  staticPageGenerationTimeout: 180,
  transpilePackages: ["@nexora/sdk"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["@react-native-async-storage/async-storage"] = require.resolve("./src/utils/async-storage-stub.ts");
    const appNodeModules = path.resolve(__dirname, "node_modules");
    // Ensure single copies of shared runtime deps so hooks see the provider context.
    config.resolve.alias.react = path.join(appNodeModules, "react");
    config.resolve.alias["react-dom"] = path.join(appNodeModules, "react-dom");
    config.resolve.alias.wagmi = path.join(appNodeModules, "wagmi");
    config.resolve.alias["@wagmi/core"] = path.join(appNodeModules, "@wagmi/core");
    config.resolve.alias["@wagmi/connectors"] = path.join(appNodeModules, "@wagmi/connectors");
    config.resolve.alias.viem = path.join(appNodeModules, "viem");
    config.resolve.alias["@tanstack/react-query"] = path.join(appNodeModules, "@tanstack/react-query");
    return config;
  },
};

module.exports = nextConfig;
