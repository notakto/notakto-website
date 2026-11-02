interface HomeMenuTitleProps {
	text: string;
}

export default function HomeMenuTitle({ text }: HomeMenuTitleProps) {
	return (
		<h1 className=" text-rose-700 pixel-text-shadow text-2xl md:text-4xl tracking-widest mb-4">
			{text}
		</h1>
	);
}
