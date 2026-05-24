import type { DownloadPlatform } from "@/entities/download/model/platforms";
import PixelBorder from "@/shared/ui/pixel/PixelBorder";
import PixelButton from "@/shared/ui/pixel/PixelButton";

interface PlatformCardListProps {
	platforms: DownloadPlatform[];
}

export default function DownloadsPlatformList({
	platforms,
}: PlatformCardListProps) {
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
