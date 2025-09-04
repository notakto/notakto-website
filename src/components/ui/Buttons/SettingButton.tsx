import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface SettingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { // a custom prop you added to handle loading state
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
            disabled={disabled || loading}
            className={clsx(
                "w-full sm:w-[45%] py-4 text-white text-[30px] rounded transition-colors",
                disabled || loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700",
                loading && "flex justify-center items-center gap-2", //  only applied if loading
                className
            )}
            {...props}
        >
            {loading && (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            )}
            {/* Children = Buy coins 100 which is wrapped by Setting Button */}
            {loading ? "Processing..." : children}
        </button>
    );
}
