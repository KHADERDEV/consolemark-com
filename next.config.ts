import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/destej60y/image/upload/**",
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
