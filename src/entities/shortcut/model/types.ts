export interface Shortcut {
	key: string;
	action: string;
}

export type ShortcutHandler = (event: KeyboardEvent) => void;
export type ShortcutMap = Record<string, ShortcutHandler>;
