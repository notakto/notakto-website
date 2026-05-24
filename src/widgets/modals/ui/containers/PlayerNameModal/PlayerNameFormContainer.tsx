import type { PlayerNameFormProps } from "@/widgets/ui/types";

export default function PlayerNameFormContainer({
	children,
}: PlayerNameFormProps) {
	return <form className="mb-6 gap-4 flex flex-col">{children}</form>;
}
