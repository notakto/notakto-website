interface GameStatLabelProps {
	label: string;
}

export default function GameStatLabel({ label }: GameStatLabelProps) {
	return (
		<div className="font-pixel text-[7px] text-muted uppercase mt-0.5">
			{label}
		</div>
	);
}
