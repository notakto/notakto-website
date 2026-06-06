interface GameStatValueProps {
	value: string | number;
}

export default function GameStatValue({ value }: GameStatValueProps) {
	return <div className="font-pixel text-[14px] text-cream">{value}</div>;
}
