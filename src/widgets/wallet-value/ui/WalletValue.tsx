interface WalletValueProps {
	value: number;
	label: string;
}

export default function WalletValue({ value, label }: WalletValueProps) {
	return (
		<span className=" text-[10px] text-yellow-500">
			{value} {label}
		</span>
	);
}
