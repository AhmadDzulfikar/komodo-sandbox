import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "12seasalliance.uk",
        pathname: "/=boats/**",
      },
      {
        protocol: "https",
        hostname: "12seasalliance.uk",
        pathname: "/cabins/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/thumbnail",
      },
    ],
  },
};

export default nextConfig;
