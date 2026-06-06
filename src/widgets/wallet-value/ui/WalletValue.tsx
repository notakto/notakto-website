interface WalletValueProps {
	value: number;
	label: string;
}

export default function WalletValue({ value, label }: WalletValueProps) {
	return (
		<span className="font-pixel text-[10px] text-accent">
			{value} {label}
		</span>
	);
}
