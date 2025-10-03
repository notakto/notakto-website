import { InputHTMLAttributes } from "react";

export function SoundConfigSlider({
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="range"
            min="0"
            max="100"
            className={
                "flex-2 mx-2 accent-[#0055ff]"
            }
        />
    );
}
