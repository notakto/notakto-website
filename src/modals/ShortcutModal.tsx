'use client'

type ShortcutModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function ShortcutModal({ visible, onClose }: ShortcutModalProps) {
    if (!visible) return null;

    const shortcuts = [
        { key: 'Esc', action: 'Close modal / toggle settings menu' },
        { key: 'R', action: 'Reset the game' },
        { key: 'N', action: 'Reset player names (vs Player mode)' },
        { key: 'C', action: 'Open game configuration' },
        { key: 'M', action: 'Go to main menu' },
        { key: 'S', action: 'Adjust sound settings' },
        { key: 'Enter', action: 'Return to game' },
        { key: '1-3', action: 'Quick game mode selection (main menu)' },
        { key: 'T', action: 'Open tutorial (main menu)' },
        { key: 'K', action: 'Show keyboard shortcuts (main menu)' },
    ];

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <div className="bg-black p-6 w-[90%] max-w-md space-y-6 text-white rounded-xl shadow-lg">
                <h2 className="text-red-500 text-4xl mb-2">Keyboard Shortcuts</h2>

                {/* Success notice */}
                <div className="bg-green-500/20 border border-green-500 text-green-400 p-3 rounded-lg text-md">
                    ✅ Keyboard shortcuts are now active! Use them to navigate quickly through the game.
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                    {shortcuts.map((shortcut) => (
                        <div key={shortcut.key} className="flex flex-col items-start">
                            <h4 className="font-extrabold text-xl">{shortcut.key}</h4>
                            <p className="text-lg text-gray-300">{shortcut.action}</p>
                        </div>
                    ))}
                </div>

                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-xl w-full mt-4 rounded-lg"
                    onClick={onClose}
                >
                    Return
                </button>
            </div>
        </div>
    );
}
