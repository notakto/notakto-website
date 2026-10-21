import clsx from "clsx";
import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function LeaderboardInfo() {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;

		const handlePointer = (e: PointerEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};

		document.addEventListener("pointerdown", handlePointer);
		document.addEventListener("keydown", handleKey);

		return () => {
			document.removeEventListener("pointerdown", handlePointer);
			document.removeEventListener("keydown", handleKey);
		};
	}, [open]);

	return (
		<div ref={ref} className="relative inline-flex">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				aria-label="How the leaderboard is ranked"
				aria-expanded={open}
				className={clsx(
					"p-2 -m-2 text-cream/70 hover:text-accent transition-colors cursor-pointer",
					open && "text-accent",
				)}>
				<CircleHelp size={18} />
			</button>

			{open && (
				<div
					role="tooltip"
					className="absolute right-0 top-full mt-3 w-[min(20rem,80vw)] z-20 bg-panel pixel-border p-3 sm:p-4 text-left font-pixel text-xs normal-case tracking-normal leading-relaxed text-cream">
					<p className="uppercase tracking-widest text-accent mb-2">
						How ranking works
					</p>
					<ul className="space-y-2 list-disc pl-4 text-cream/80">
						<li>
							Ties share the same rank and the next rank is skipped (1, 1, 3).
						</li>
						<li>Tied players are sorted alphabetically by username.</li>
					</ul>
				</div>
			)}
		</div>
	);
}
