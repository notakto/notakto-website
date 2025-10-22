import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export function WinnerButton({
	className, // pulls out className separately
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type ="button"
            className={clsx(
                "bg-blue-600 text-white px-6 py-3 w-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400", // default styles for winner button
                className
                // merge any custom classes passed in | right now none present in case any new style or re use of this button 
            )}
            {...props}
        />
    );
}
