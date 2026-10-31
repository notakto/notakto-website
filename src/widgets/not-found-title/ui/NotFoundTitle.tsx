interface NotFoundTitleProps {
	text: string;
}

export default function NotFoundTitle({ text }: NotFoundTitleProps) {
	return (
		<h1 className=" text-rose-700 text-lg pixel-text-shadow mb-4 uppercase">
			{text}
		</h1>
	);
}
