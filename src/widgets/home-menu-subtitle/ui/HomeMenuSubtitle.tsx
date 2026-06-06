interface HomeMenuSubtitleProps {
	text: string;
}

export default function HomeMenuSubtitle({ text }: HomeMenuSubtitleProps) {
	return (
		<p className="font-pixel text-[8px] text-cream-dim tracking-wider">
			{text}
		</p>
	);
}
