import type { PlayerNameFormProps } from "@/widgets/types";

export default function PlayerNameFormContainer({
	children,
}: PlayerNameFormProps) {
	return <form className="mb-6 gap-4 flex flex-col">{children}</form>;
}
