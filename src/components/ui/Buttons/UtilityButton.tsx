import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface UtilityButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const UtilityButton = ({ children, className, ...props }: UtilityButtonProps) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 text-base sm:px-2 sm:py-1 sm:text-sm",          // spacing & font
        "rounded-md bg-blue-600 text-white font-medium",             // primary blue background
        "hover:bg-blue-700 transition",                               // hover transition
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-300", // focus ring for accessibility
        className                                                    // merge any additional classes
      )}
      {...props}
    >
      {children}
    </button>
  );
};

