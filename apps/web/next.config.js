/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@arc/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.cloudflare.com" },
    ],
  },
};

module.exports = nextConfig;
