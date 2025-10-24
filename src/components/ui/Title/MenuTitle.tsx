import { AnimatedTitle } from "@/components/ui/Effects/AnimatedTitle";

export const MenuTitle = ({ text }: { text: string }) => (
	<AnimatedTitle
		text={text}
		// KEEPING ORIGINAL LARGE DESKTOP MARGIN (-mb-10) and applying it specifically at the 'lg' breakpoint.
		// Scaling down the margin for mobile and medium screens.
		className="-mb-5 md:-mb-8 lg:-mb-10" 
		
		// KEEPING ORIGINAL LARGE DESKTOP FONT SIZE (text-[180px]) and applying it specifically at the 'lg' breakpoint.
		// SCALING UP the mobile font size for better impact (e.g., text-[90px]).
		textClassName="text-red-600 text-[90px] md:text-[130px] lg:text-[180px]"
	/>
);