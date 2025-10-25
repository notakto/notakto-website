import { AnimatedTitle } from "@/components/ui/Effects/AnimatedTitle";

export const MenuTitle = ({ text }: { text: string }) => (
	<AnimatedTitle
			text={text}
			className="-mb-6 md:-mb-8 lg:-mb-10"
			textClassName="text-red-600 [font-size:clamp(97px,19vw,180px)]"
	/>
);
