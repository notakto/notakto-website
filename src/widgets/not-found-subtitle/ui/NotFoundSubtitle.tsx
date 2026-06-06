interface NotFoundSubtitleProps {
	text: string;
}

export default function NotFoundSubtitle({ text }: NotFoundSubtitleProps) {
	return <p className="text-sm font-pixel text-cream mb-6">{text}</p>;
}
