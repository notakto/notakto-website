type ShortcutMap = Record<string, (event: KeyboardEvent) => void>;

class ShortcutManagerSingleton {
	private isEnabled = true;
	private currentShortcuts: ShortcutMap = {};
	private isInitialized = false;

	/**
	 * Attaches the single, global keydown listener to the window.
	 * This should only be called once in the application's lifecycle.
	 */
	public init() {
		if (this.isInitialized || typeof window === "undefined") {
			return;
		}
		window.addEventListener("keydown", this.handleKeyDown);
		this.isInitialized = true;
	}

	/**
	 * The global kill switch.
	 * @param enabled - If true, shortcuts are processed. If false, all shortcuts are ignored.
	 */
	public setEnabled(enabled: boolean) {
		this.isEnabled = enabled;
	}

	/**
	 * Allows React components to register the shortcuts for the current view.
	 * @param shortcuts - The map of shortcuts to be used.
	 */
	public registerShortcuts(shortcuts: ShortcutMap) {
		this.currentShortcuts = shortcuts;
	}

	// This is the *only* keydown handler in the entire application.
	private handleKeyDown = (e: KeyboardEvent) => {
		// 1. Check the global kill switch first.
		if (!this.isEnabled) {
			return;
		}

		const key = e.key.toLowerCase();
		const el = e.target as HTMLElement | null;
		const tag = el?.tagName?.toLowerCase();

		if (e.isComposing || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
		if (tag === "input" || tag === "textarea" || el?.isContentEditable) return;

		// 2. Check if the pressed key is in the currently registered map.
		if (this.currentShortcuts[key]) {
			e.preventDefault();
			this.currentShortcuts[key](e);
		}
	};
}

// Export a single instance for the entire app to use.
export const ShortcutManager = new ShortcutManagerSingleton();