/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = withPWA({
  // Not setting reactStrictMode here due to issues with modal compatibility, but rest of app is wrapped in strict mode.
  images: {
    loader: "akamai",
    path: "",
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      // https://github.com/vercel/next.js/issues/7755#issuecomment-937721514
      config.resolve.fallback.fs = false;
    }
    config.resolve.mainFields = ["browser", "main", "module"];
    return config;
  },
});

module.exports = nextConfig;
