import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function MenuButton({
    className, // pulls out className separately
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={clsx(
                "w-full bg-blue-600 py-4 text-white text-3xl", // default styles
                className // merge any custom classes passed in
            )}
            {...props}
        />
    );
}
