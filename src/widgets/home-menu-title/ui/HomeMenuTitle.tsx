interface HomeMenuTitleProps {
	text: string;
}

export default function HomeMenuTitle({ text }: HomeMenuTitleProps) {
	return (
		<h1 className="font-pixel text-primary pixel-text-shadow text-2xl md:text-4xl tracking-widest mb-4">
			{text}
		</h1>
	);
}
