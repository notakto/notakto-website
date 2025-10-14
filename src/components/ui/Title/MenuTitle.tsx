import { AnimatedTitle } from "@/components/ui/Effects/AnimatedTitle";

export const MenuTitle = ({ text }: { text: string }) => (
	<AnimatedTitle
		text={text}
		// Match spacing with bottom padding (pb-8 = 32px)
		className="mb-8"
		textClassName="text-red-600 text-[180px]"
	/>
);
