interface HomeMenuSubtitleProps {
	text: string;
}

export default function HomeMenuSubtitle({ text }: HomeMenuSubtitleProps) {
	return <p className=" text-[8px] text-stone-400 tracking-wider">{text}</p>;
}
