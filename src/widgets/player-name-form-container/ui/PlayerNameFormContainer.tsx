import type { ReactNode } from "react";

interface PlayerNameFormProps {
	children?: ReactNode;
	className?: string;
}

export default function PlayerNameFormContainer({
	children,
}: PlayerNameFormProps) {
	return <form className="mb-6 gap-4 flex flex-col">{children}</form>;
}
