import { ReactNode } from "react";

interface MenuContainerProps {
    children: ReactNode;
}

export default function MenuContainer({ children }: MenuContainerProps) {
    return (
            <div className="flex flex-col items-center gap-4 w-full max-w-lg px-4">
                {children}
            </div>

    );
}