import type { ReactNode } from "react";

interface BoardConfigContainerProps {
	children: ReactNode;
}

export default function BoardConfigContainer({
	children,
}: BoardConfigContainerProps) {
	return (
		<section className="bg-black p-6 w-[90%] max-w-xl text-center space-y-6">
			{children}
		</section>
	);
}
