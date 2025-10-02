import { ButtonHTMLAttributes } from "react";

export function SoundMuteButton({
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={"bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-lg"}
            {...props}
        />
    );
}
