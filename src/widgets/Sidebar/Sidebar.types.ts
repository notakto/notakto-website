export type GameModalAction =
	| "resetConfirmation"
	| "boardConfig"
	| "difficulty"
	| "names"
	| "exitConfirmation";

export interface GameButton {
	label: string;
	icon: string;
	modal: GameModalAction;
}

export type ModalAction = "tutorial" | "soundConfig" | "shortcut" | "profile";

export type NavItem =
	| { href: string; label: string; icon: string }
	| { href: string; label: string; icon: string; external: true };
