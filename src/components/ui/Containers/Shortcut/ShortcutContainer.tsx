import type { ShortcutContainerProps } from "@/services/types";

export default function ShortcutContainer({
	children,
}: ShortcutContainerProps) {
	return (
		<section className="bg-panel pixel-border p-6 w-[90%] max-w-md space-y-6 text-cream">
			{children}
		</section>
	);
}
