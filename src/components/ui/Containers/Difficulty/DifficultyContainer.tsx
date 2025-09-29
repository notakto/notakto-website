import { ReactNode } from "react";

interface BoardConfigContainerProps {
    children: ReactNode;
}

export default function BoardConfigContainer({ children }: BoardConfigContainerProps) {
    return (
        <div className="bg-black w-full max-w-md p-6">
            {children}
        </div>

    );
}