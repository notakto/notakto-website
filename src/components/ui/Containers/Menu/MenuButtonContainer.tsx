import { ReactNode } from "react";

interface MenuButtonContainerProps {
    children: ReactNode;
}

export default function MenuButtonContainer({ children }: MenuButtonContainerProps) {
    return (
            <div className="flex flex-col items-center gap-4 w-full max-w-md px-6">
                {children}
            </div>

    );
}