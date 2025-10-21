import { AnimatedTitle } from "@/components/ui/Effects/AnimatedTitle";

export const MenuTitle = ({ text }: { text: string }) => (
	<AnimatedTitle
		text={text}
		// Keep sizing/margin close to existing to avoid broad visual diffs
		className="-mb-10"
		textClassName="text-red-600 text-[180px]"
	/>
);
