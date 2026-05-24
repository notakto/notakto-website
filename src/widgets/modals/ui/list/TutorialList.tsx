import type { TutorialListProps } from "@/widgets/ui/types";

const TutorialList = ({ items }: TutorialListProps) => (
	<ul className="text-cream font-pixel text-[9px] leading-8 mb-6 whitespace-pre-line">
		{items.map((item) => (
			<li key={item}>• {item}</li>
		))}
	</ul>
);

export default TutorialList;
