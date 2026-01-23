/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [50, 80, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
