import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface UtilityButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const UtilityButton = ({ children, className, ...props }: UtilityButtonProps) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 text-base sm:px-2 sm:py-1 sm:text-sm", // spacing & font
        "rounded-md bg-red-600 text-white font-medium",       // shape & color
        "hover:bg-red-700 transition",                        // hover & transition
        className                                           // merge any additional classes
      )}
      {...props}
    >
      {children}
    </button>
  );
};
