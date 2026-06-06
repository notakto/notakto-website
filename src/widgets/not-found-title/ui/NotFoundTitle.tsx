interface NotFoundTitleProps {
	text: string;
}

export default function NotFoundTitle({ text }: NotFoundTitleProps) {
	return (
		<h1 className="font-pixel text-primary text-lg pixel-text-shadow mb-4 uppercase">
			{text}
		</h1>
	);
}
