'use client'
import React, { useState, ChangeEvent } from "react";

type SoundConfigModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function SoundConfigModal({ visible, onClose }: SoundConfigModalProps) {
    console.log("SoundConfig got Rendered");

    const [backgroundVolume, setBackgroundVolume] = useState<number>(70);
    const [playerVolume, setPlayerVolume] = useState<number>(70);

    const [backgroundMuted, setBackgroundMuted] = useState<boolean>(false);
    const [playerMuted, setPlayerMuted] = useState<boolean>(false);

    const resetSounds = () => {
        setBackgroundVolume(70);
        setPlayerVolume(70);
        setBackgroundMuted(false);
        setPlayerMuted(false);
    };

    const handleVolumeChange =
        (setter: React.Dispatch<React.SetStateAction<number>>) =>
            (e: ChangeEvent<HTMLInputElement>) => {
                setter(Number(e.target.value));
            };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
            <div className="bg-black p-6 w-[90%] max-w-xl space-y-6  text-center text-white shadow-[0_0_10px_#0055ff]">
                <h2 className="text-red-600 text-[35px]">Sound Configuration</h2>

                {/* Background Music */}
                <div className="my-4 flex items-center justify-between">
                    <label className="text-red-600 text-2xl flex-1 text-left">
                        Background Music
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={backgroundMuted ? 0 : backgroundVolume}
                        onChange={handleVolumeChange(setBackgroundVolume)}
                        className="flex-2 mx-2 accent-[#0055ff]"
                    />
                    <button
                        onClick={() => setBackgroundMuted(!backgroundMuted)}
                        className="bg-[#0055ff] hover:bg-[#0033aa] text-white px-3 py-2 text-lg"
                    >
                        {backgroundMuted ? "Unmute" : "Mute"}
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
                        value={playerMuted ? 0 : playerVolume}
                        onChange={handleVolumeChange(setPlayerVolume)}
                        className="flex-2 mx-2 accent-[#0055ff]"
                    />
                    <button
                        onClick={() => setPlayerMuted(!playerMuted)}
                        className="bg-[#0055ff] hover:bg-[#0033aa] text-white px-3 py-2 text-lg"
                    >
                        {playerMuted ? "Unmute" : "Mute"}
                    </button>
                </div>

                {/* Controls */}
                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={resetSounds}
                        className="bg-[#0055ff] hover:bg-[#0033aa] text-white py-3 text-xl flex-1"
                    >
                        Reset Sounds
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-[#0055ff] hover:bg-[#0033aa] text-white  py-3 text-xl flex-1"
                    >
                        Return
                    </button>
                </div>
            </div>
        </div>
    );
}
