interface SplashBootTextProps {
	dimmed: boolean;
}

export default function SplashBootText({ dimmed }: SplashBootTextProps) {
	return (
		<div
			className={`font-pixel text-[8px] text-muted mb-8 animate-boot-flicker ${dimmed ? "opacity-40" : ""}`}>
			NOTAKTO SYSTEMS v2.1
		</div>
	);
}
