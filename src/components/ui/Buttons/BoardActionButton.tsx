import { ButtonHTMLAttributes } from "react";

export function BoardActionButton({
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={"flex-1 py-3 bg-blue-600 cursor-pointer text-white text-xl hover:bg-blue-700"}
            {...props}
        />
    );
}
