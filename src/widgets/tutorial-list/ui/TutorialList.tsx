import TutorialListItem from "@/widgets/tutorial-list-item/ui/TutorialListItem";

interface TutorialListProps {
	items: string[];
}

const TutorialList = ({ items }: TutorialListProps) => (
	<ul className="text-cream font-pixel text-[9px] leading-8 mb-6 whitespace-pre-line">
		{items.map((item) => (
			<TutorialListItem key={item} item={item} />
		))}
	</ul>
);

export default TutorialList;
