interface SplashSystemCheckProps {
	dimmed: boolean;
}

export default function SplashSystemCheck({ dimmed }: SplashSystemCheckProps) {
	return (
		<div
			className={`font-pixel text-[7px] text-success space-y-2 mb-8 animate-slide-up ${dimmed ? "opacity-40" : ""}`}>
			<div>RAM OK ............. 128K</div>
			<div>BOARD CHECK ........ PASS</div>
			<div>SYSTEM ............. READY</div>
		</div>
	);
}
