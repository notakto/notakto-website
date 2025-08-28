import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function MenuButton({
    className, // pulls out className separately
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={clsx(
                "w-full bg-blue-600 py-[9.5px] text-white text-[28px]", // default styles
                className // merge any custom classes passed in
            )}
            {...props}
        />
    );
}
