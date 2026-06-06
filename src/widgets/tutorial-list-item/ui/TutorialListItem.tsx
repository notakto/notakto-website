interface TutorialListItemProps {
	item: string;
}

export default function TutorialListItem({ item }: TutorialListItemProps) {
	return <li>• {item}</li>;
}
