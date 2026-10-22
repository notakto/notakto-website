import type { MetadataRoute } from "next";

const BASE_URL = "https://www.notakto.xyz";

/**
 * The site's sitemap, served at /sitemap.xml by the App Router convention.
 * robots.txt points here. Add a row whenever a new top-level route ships.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();

	return [
		{ url: BASE_URL, changeFrequency: "weekly", priority: 1 },
		{ url: `${BASE_URL}/vsComputer`, changeFrequency: "monthly", priority: 0.8 },
		{ url: `${BASE_URL}/vsPlayer`, changeFrequency: "monthly", priority: 0.8 },
		{ url: `${BASE_URL}/liveMatch`, changeFrequency: "weekly", priority: 0.7 },
		{ url: `${BASE_URL}/downloads`, changeFrequency: "monthly", priority: 0.5 },
	].map((entry) => ({ ...entry, lastModified }));
}
