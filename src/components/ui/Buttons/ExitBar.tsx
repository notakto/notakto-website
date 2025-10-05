import { ButtonHTMLAttributes } from "react";

interface ExitBarProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text: String;
}
export default function ExitBar({
    text,
    ...props

}: ExitBarProps) {
    return (

        <div className="w-full bg-red-600 py-3 text-center mt-auto">
            <button
                {...props}
                className="text-white text-2xl">
                {text}
            </button>
        </div>


    );
}
