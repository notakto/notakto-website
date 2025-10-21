interface TutorialListProps {
	items: string[];
}

const TutorialList = ({ items }: TutorialListProps) => (
	<ul className="text-white text-lg leading-6 mb-6 whitespace-pre-line">
		{items.map((item) => (
			<li key={item}>• {item}</li>
		))}
	</ul>
);

export default TutorialList;
