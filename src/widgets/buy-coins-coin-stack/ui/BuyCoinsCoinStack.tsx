import clsx from "clsx";

interface BuyCoinsCoinStackProps {
	count: 2 | 3 | 4;
}

const COIN_POSITIONS = [
	"left-0 top-5",
	"left-5 top-1",
	"left-10 top-6",
	"left-16 top-2",
];

export default function BuyCoinsCoinStack({ count }: BuyCoinsCoinStackProps) {
	return (
		<span
			aria-hidden="true"
			className={clsx("relative block h-16", count === 4 ? "w-28" : "w-20")}>
			{COIN_POSITIONS.slice(0, count).map((position) => (
				<span
					key={position}
					className={clsx(
						"absolute h-9 w-9 border-4 border-accent bg-[#f0c45a] shadow-[3px_3px_0_var(--color-bg0)]",
						position,
					)}>
					<span className="absolute inset-2 border-3 border-accent-dim" />
				</span>
			))}
		</span>
	);
}
