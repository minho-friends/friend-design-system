import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
  webpack: (config) => {
    config.resolve.modules = [
      path.join(__dirname, "../../node_modules"),
      "node_modules",
    ];
    return config;
  },
  transpilePackages: [
    "@minho-friends/friend-design-system--lit",
    "@minho-friends/friend-design-system--react",
    "@minho-friends/friend-design-system--json-render",
    "streamdown",
    "@streamdown/code",
    "@json-render/react",
  ],
};
export default nextConfig;
