'use client'
import { useSound } from "@/services/store";

type SoundConfigModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function SoundConfigModal({ visible, onClose }: SoundConfigModalProps) {
    const {
        bgMute, bgVolume, setBgMute, setBgVolume,
        sfxMute, sfxVolume, setSfxMute, setSfxVolume
    } = useSound();

    const resetSounds = () => {
        setBgVolume(0.3);
        setSfxVolume(0.5);
        // setBgMute(true); // incase reset sound is supposed to make it mute also
        // setSfxMute(true);
    };


    if (!visible) return null;
    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <div className="bg-black p-6 w-[90%] max-w-xl space-y-6  text-center text-white">
                <h2 className="text-red-500 text-[35px]">Sound Configuration</h2>

                {/* Background Music */}
                <div className="my-4 flex items-center justify-between">
                    <label className="text-red-500 text-2xl flex-1 text-left">
                        Background Music
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={Math.round(bgVolume * 100)}
                        onChange={(e) => setBgVolume(Number(e.target.value) / 100)}
                        className="flex-2 mx-2 accent-[#0055ff]"
                    />
                    <button
                        onClick={() => setBgMute(!bgMute)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-lg"
                    >
                        {bgMute ? "Unmute" : "Mute"}
                    </button>
                </div>

                {/* Player Move */}
                <div className="my-4 flex items-center justify-between">
                    <label className="text-red-500 text-2xl flex-1 text-left">
                        Player Move Sound
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={Math.round(sfxVolume * 100)}
                        onChange={(e) => setSfxVolume(Number(e.target.value) / 100)}
                        className="flex-2 mx-2 accent-[#0055ff]"
                    />
                    <button
                        onClick={() => setSfxMute(!sfxMute)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-lg"
                    >
                        {sfxMute ? "Unmute" : "Mute"}
                    </button>
                </div>

                {/* Controls */}
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={resetSounds}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 text-xl flex-1"
                    >
                        Reset Sounds
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-blue-600 hover:bg-blue-700 text-white  py-3 text-xl flex-1"
                    >
                        Return
                    </button>
                </div>
            </div>
        </div>
    );
}
