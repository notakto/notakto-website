interface GameStatLabelProps {
	label: string;
}

export default function GameStatLabel({ label }: GameStatLabelProps) {
	return (
		<div className=" text-[7px] text-gray-500 uppercase mt-0.5">{label}</div>
	);
}
