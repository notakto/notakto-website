import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function TutorialButton({
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={
                "bg-red-600 text-white text-xl px-6 py-3 rounded text-center w-full"
            }
            {...props}
        />
    );
}
