import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function WinnerButton({
    className, // pulls out className separately
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={clsx(
                "bg-blue-600 text-white px-6 py-3 w-full hover:bg-blue-700", // default styles for winner button
                className
                // merge any custom classes passed in | right now none present in case any new style or re use of this button 
            )}
            {...props}
        />
    );
}
