import type { ReactNode } from "react";

interface PlayerNameFormProps {
	children: ReactNode;
}

export default function PlayerNameFormContainer({
	children,
}: PlayerNameFormProps) {
	return <div className="mb-6 gap-4 flex flex-col">{children}</div>;
}
