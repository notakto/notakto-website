import type { WinnerContainerProps } from "@/services/types";

export default function WinnerContainer({ children }: WinnerContainerProps) {
	return (
		<section className="bg-black text-center rounded-xl p-6 w-[80%] max-w-md shadow-2xl">
			{children}
		</section>
	);
}
