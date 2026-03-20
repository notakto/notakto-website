"use client";

const PLATFORMS = [
	{ name: "WINDOWS", icon: "W", desc: "Windows 10+" },
	{ name: "MACOS", icon: "M", desc: "macOS 12+" },
	{ name: "LINUX", icon: "L", desc: "Ubuntu 20.04+" },
	{ name: "ANDROID", icon: "A", desc: "Android 10+" },
	{ name: "IOS", icon: "I", desc: "iOS 15+" },
];

export default function DownloadsPage() {
	return (
		<StaticPageLayout
			maxWidth="md"
			title="Downloads"
			subtitle="GET NOTAKTO FOR YOUR PLATFORM">
			<PlatformCardList platforms={PLATFORMS} />
		</StaticPageLayout>
	);
}

// ===== COMPONENTS =====
function StaticPageLayout({
	maxWidth,
	title,
	subtitle,
	children,
}: {
	maxWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
	title: string;
	subtitle: string;
	children: React.ReactNode;
}) {
	const maxWidthClass = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
		"2xl": "max-w-2xl",
		full: "max-w-full",
	};

	return (
		<div
			className={`flex-1 flex flex-col items-center justify-center px-6 py-12 ${maxWidthClass[maxWidth]} mx-auto`}>
			<div className="text-center mb-8 animate-drop">
				<h1 className="font-pixel text-primary pixel-text-shadow text-2xl md:text-3xl tracking-widest mb-4">
					{title}
				</h1>
				<p className="font-pixel text-[8px] text-cream-dim tracking-wider">
					{subtitle}
				</p>
				<div className="h-[3px] bg-border-pixel mt-6 mx-auto w-48 shadow-[0_1px_0_var(--color-bg0)]" />
			</div>
			{children}
		</div>
	);
}

function PixelBorder({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <div className={`pixel-border bg-panel ${className}`}>{children}</div>;
}

function PixelButton({
	children,
	disabled = false,
	size = "md",
	onClick,
}: {
	children: React.ReactNode;
	disabled?: boolean;
	size?: "sm" | "md" | "lg";
	onClick?: () => void;
}) {
	const sizeClasses = {
		sm: "px-4 py-2 text-[8px]",
		md: "px-6 py-3 text-[10px]",
		lg: "px-8 py-4 text-[12px]",
	};

	return (
		<button
			type="button"
			disabled={disabled}
			onClick={onClick}
			className={`
				font-pixel uppercase tracking-wider border-3 shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer
				${
					disabled
						? "bg-dead border-dead-border text-muted cursor-not-allowed shadow-none"
						: "bg-primary hover:bg-primary-hover border-border-light text-cream"
				}
				${sizeClasses[size]}
			`}>
			{children}
		</button>
	);
}

function PlatformCardList({
	platforms,
}: {
	platforms: { name: string; icon: string; desc: string }[];
}) {
	return (
		<div className="grid gap-4 w-full">
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
