import type {
	GameButton,
	ModalAction,
	NavItem,
} from "@/widgets/Sidebar/Sidebar.types";

export const NAV_ITEMS: NavItem[] = [
	{ href: "/vsComputer", label: "VS CPU", icon: ">" },
	{ href: "/vsPlayer", label: "VS PLAYER", icon: "+" },
	{ href: "/liveMatch", label: "LIVE", icon: "#" },
	{ href: "/downloads", label: "DOWNLOADS", icon: "=" },
	{
		href: "https://github.com/notakto/notakto-website/issues",
		label: "BUG REPORT",
		icon: "!",
		external: true,
	},
];

export const MODAL_ITEMS: {
	label: string;
	icon: string;
	modal: ModalAction;
}[] = [
	{ label: "TUTORIAL", icon: "?", modal: "tutorial" },
	{ label: "SOUND", icon: "~", modal: "soundConfig" },
	{ label: "SHORTCUTS", icon: "K", modal: "shortcut" },
	{ label: "PROFILE", icon: "@", modal: "profile" },
];

export const GAME_PAGES = ["/vsPlayer", "/vsComputer", "/liveMatch"];

export const GAME_BUTTONS: Record<string, GameButton[]> = {
	"/vsPlayer": [
		{ label: "RESET", icon: "R", modal: "resetConfirmation" },
		{ label: "CONFIG", icon: "C", modal: "boardConfig" },
		{ label: "NAMES", icon: "N", modal: "names" },
		{ label: "EXIT TO MENU", icon: "X", modal: "exitConfirmation" },
	],
	"/vsComputer": [
		{ label: "RESET", icon: "R", modal: "resetConfirmation" },
		{ label: "CONFIG", icon: "C", modal: "boardConfig" },
		{ label: "AI LEVEL", icon: "D", modal: "difficulty" },
		{ label: "EXIT TO MENU", icon: "X", modal: "exitConfirmation" },
	],
	"/liveMatch": [
		{ label: "EXIT TO MENU", icon: "X", modal: "exitConfirmation" },
	],
};
