'use client'

type ShortcutModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function ShortcutModal({ visible, onClose }: ShortcutModalProps) {
    if (!visible) return null;

    const shortcuts = [
        { key: 'Esc', action: 'Close the modal / pause menu' },
        { key: 'R', action: 'Reset the game' },
        { key: 'N', action: 'Reset player names' },
        { key: 'C', action: 'Open game configuration' },
        { key: 'M', action: 'Go to main menu' },
        { key: 'S', action: 'Adjust sound' },
        { key: 'Enter', action: 'Return to game' },
    ];

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <div className="bg-black p-6 w-[90%] max-w-md space-y-6 text-white rounded-xl shadow-lg">
                <h2 className="text-red-500 text-4xl mb-2">Keyboard Shortcuts</h2>

                {/* Pending notice */}
                <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-400 p-3 rounded-lg text-md">
                    ⚠️ NOTE : These shortcuts are for reference only. Implementation is pending, so they
                    won’t work right now.
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
