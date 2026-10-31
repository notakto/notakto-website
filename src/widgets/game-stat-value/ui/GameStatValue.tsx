interface GameStatValueProps {
	value: string | number;
}

export default function GameStatValue({ value }: GameStatValueProps) {
	return <div className=" text-[14px] text-stone-300">{value}</div>;
}
