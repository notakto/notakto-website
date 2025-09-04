import clsx from "clsx";

interface DifficultyActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "level" | "cancel";
}

export function DifficultyActionButton({
    variant = "level",
    children,
    ...props
}: DifficultyActionProps) {
    return (
        <button
            className={clsx(
                "w-full py-3 text-3xl transition text-white",
                variant === "level" && "bg-blue-600 hover:bg-blue-700 my-2",
                variant === "cancel" && "bg-red-600 hover:bg-red-700 mt-4",
            )}
            {...props}
        >
            {children}
        </button>
    );
}
