import { ButtonHTMLAttributes } from "react";

export function SoundConfigButton({
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={"bg-blue-600 hover:bg-blue-700 text-white  py-3 text-xl flex-1"}
            {...props}
        />
    );
}
