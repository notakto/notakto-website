interface GameModeTitleProps {
	title: string;
}

export default function GameModeTitle({ title }: GameModeTitleProps) {
	return (
		<div className="font-pixel text-sm text-cream uppercase tracking-wider group-hover:text-pixel-white transition-colors">
			{title}
		</div>
	);
}
