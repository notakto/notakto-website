import TutorialListItem from "@/widgets/tutorial-list-item/ui/TutorialListItem";

interface TutorialListProps {
	items: string[];
}

const TutorialList = ({ items }: TutorialListProps) => (
	<ul className="text-stone-300  text-[9px] leading-8 mb-6 whitespace-pre-line">
		{items.map((item) => (
			<TutorialListItem key={item} item={item} />
		))}
	</ul>
);

export default TutorialList;
