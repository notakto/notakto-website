import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface SettingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	// a custom prop you added to handle loading state
	loading?: boolean;
	children: ReactNode; // accept any react child
}

export function SettingButton({
	className,
	disabled = false,
	loading = false,
	children,
	...props
}: SettingButtonProps) {
    return (
        <button
            type ="button"
            disabled={disabled || loading}
            className={clsx(
                "w-full sm:w-[45%] py-4 text-white text-[30px] rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400",
                disabled || loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700",
                loading && "flex justify-center items-center gap-2", //  only applied if loading
                className
            )}
            {...props}
        >
            {loading && (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                aria-hidden="true" />
            )}
            {/* Children = Buy coins 100 which is wrapped by Setting Button */}
            {loading ? "Processing..." : children}
        </button>
    );
}
