import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	images: {
		unoptimized: false,
		minimumCacheTTL: 60,
		remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
	experimental: {
		optimizePackageImports: ["@mui/material", "@mui/icons-material"],
	},
	compress: true,
	turbopack: {},
};

export default nextConfig;
