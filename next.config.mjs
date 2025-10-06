/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		unoptimized: false,
		minimumCacheTTL: 60,
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
	experimental: {
		optimizePackageImports: ["@mui/material", "@mui/icons-material"],
	},
	compress: true,
	webpack: (config) => {
		return config;
	},
};

export default nextConfig;
