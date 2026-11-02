interface NotFoundSubtitleProps {
	text: string;
}

export default function NotFoundSubtitle({ text }: NotFoundSubtitleProps) {
	return <p className="text-sm  text-stone-300 mb-6">{text}</p>;
}
