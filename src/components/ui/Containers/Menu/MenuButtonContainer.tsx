import { ReactNode } from "react";

interface MenuButtonContainerProps {
    children: ReactNode;
}

export default function MenuButtonContainer({ children }: MenuButtonContainerProps) {
    return (
        <div className="space-y-6">
            {children}
        </div>
    );
}

interface MenuSectionProps {
    title: string;
    children: ReactNode;
    className?: string;
}

export function MenuSection({ title, children, className = "" }: MenuSectionProps) {
    return (
        <div className={`space-y-3 animate-float-up ${className}`}>
            <h2 className="text-lg md:text-xl font-bold text-cyan-400 text-center tracking-wider uppercase relative">
                {title}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            </h2>
            <div className="grid gap-3 px-2 md:px-0">
                {children}
            </div>
        </div>
    );
}