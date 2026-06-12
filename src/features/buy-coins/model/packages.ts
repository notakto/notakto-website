import type { BuyCoinPackage } from "@/features/buy-coins/model/types";

export const BUY_COIN_PACKAGES: BuyCoinPackage[] = [
	{
		id: "pkg_500",
		name: "Starter Pack",
		coins: 500,
		visualCoins: 2,
	},
	{
		id: "pkg_1200",
		name: "Tactical Pack",
		coins: 1200,
		visualCoins: 3,
	},
	{
		id: "pkg_3000",
		name: "Champion Pack",
		coins: 3000,
		visualCoins: 4,
	},
];

export const DEFAULT_BUY_COIN_PACKAGE_ID = "pkg_1200";
