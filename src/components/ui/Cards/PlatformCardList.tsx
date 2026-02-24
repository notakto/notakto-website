import PixelBorder from "@/components/ui/Pixel/PixelBorder";
import PixelButton from "@/components/ui/Pixel/PixelButton";
import type { PlatformCardListProps } from "@/services/types";

export default function PlatformCardList({ platforms }: PlatformCardListProps) {
	return (
		<div className="grid gap-4">
			{platforms.map((p) => (
				<PixelBorder
					key={p.name}
					className="p-6 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<span className="font-pixel text-xl text-accent w-8 text-center">
							{p.icon}
						</span>
						<div>
							<div className="font-pixel text-[10px] text-cream uppercase">
								{p.name}
							</div>
							<div className="font-pixel text-[7px] text-muted mt-1">
								{p.desc}
							</div>
						</div>
					</div>
					<PixelButton disabled size="sm">
						COMING SOON
					</PixelButton>
				</PixelBorder>
			))}
		</div>
	);
}
