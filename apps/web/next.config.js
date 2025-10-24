const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  staticPageGenerationTimeout: 180,
  transpilePackages: ["@nexora/sdk"],
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
