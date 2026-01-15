import type { NextConfig } from "next";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
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
	turbopack: {},
};

export default withNextIntl(nextConfig);
