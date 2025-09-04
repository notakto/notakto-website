import { InputHTMLAttributes } from "react";
import clsx from "clsx";

export function PlayerInput({
    className, // pulls out className separately
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={clsx(
                "w-full p-3 text-red-500 text-xl border border-gray-300 bg-white outline-none", // default styles
                className // merge any custom classes passed in
            )}
            {...props}
        />
    );
}
