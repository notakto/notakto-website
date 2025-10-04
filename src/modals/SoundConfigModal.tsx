'use client'
import { SoundMuteButton } from "@/components/ui/Buttons/SoundMuteButton";
import { SoundConfigButton } from "@/components/ui/Buttons/SoundConfigButton";
import { useSound } from "@/services/store";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import SoundConfigTitle from "@/components/ui/Title/SoundConfigTitle";
import { SoundConfigSlider } from "@/components/ui/Inputs/SoundConfigSlider";
import SoundConfigContainer from "@/components/ui/Containers/SoundConfig/SoundConfigContainer";
import SoundConfigControls from "@/components/ui/Containers/SoundConfig/SoundConfigControls";
import SoundConfigSection from "@/components/ui/Containers/SoundConfig/SoundConfigSection";
import SoundConfigLabel from "@/components/ui/Title/SoundConfigLabel";

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
        <ModalOverlay>
            <SoundConfigContainer>
                <SoundConfigTitle text="Sound Configuration" />

                {/* Background Music */}
                <SoundConfigSection>
                    <SoundConfigLabel label="Background Music" htmlFor="bg-music-slider" />
                    <SoundConfigSlider
                        id="bg-music-slider"
                        value={Math.round(bgVolume * 100)}
                        onChange={(e) => setBgVolume(Number(e.target.value) / 100)}
                    />
                    <SoundMuteButton
                        onClick={() => setBgMute(!bgMute)}
                    >
                        {bgMute ? "Unmute" : "Mute"}
                    </SoundMuteButton>
                </SoundConfigSection>

                {/* Player Move */}
                <SoundConfigSection>
                    <SoundConfigLabel label="Player Move Sound" htmlFor="player-move-slider" />
                    <SoundConfigSlider
                        id="player-move-slider"
                        value={Math.round(sfxVolume * 100)}
                        onChange={(e) => setSfxVolume(Number(e.target.value) / 100)}
                    />
                    <SoundMuteButton
                        onClick={() => setSfxMute(!sfxMute)}
                    >
                        {sfxMute ? "Unmute" : "Mute"}
                    </SoundMuteButton>
                </SoundConfigSection>

                {/* Controls */}
                <SoundConfigControls>
                    <SoundConfigButton onClick={resetSounds}>Reset Sounds</SoundConfigButton>
                    <SoundConfigButton onClick={onClose}>Return</SoundConfigButton>
                </SoundConfigControls>

            </SoundConfigContainer>
        </ModalOverlay>
    );
}
