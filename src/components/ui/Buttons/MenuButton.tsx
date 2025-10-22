import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export function MenuButton({
	className, // pulls out className separately
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={clsx(
                "w-full bg-blue-600 py-4 text-white text-3xl focus:outline-none focus:ring-2 focus:ring-blue-400", // default styles
                className // merge any custom classes passed in
            )}
            {...props}
        />
    );
}
