import clsx from "clsx";
import { ReactNode } from "react";
interface BoardContainerProps {
    blocked: boolean;
    children: ReactNode;
}

const BoardLiveContainer = ({ blocked, children }: BoardContainerProps) => (
    <div
        className={clsx(
            "w-[300px] h-[300px] flex flex-wrap bg-black",
            blocked && "opacity-50"
        )}
    >
        {children}
    </div>
);

export default BoardLiveContainer;
