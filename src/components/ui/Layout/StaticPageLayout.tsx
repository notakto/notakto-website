import type { StaticPageLayoutProps } from "@/services/types";

const maxWidthStyles: Record<string, string> = {
	sm: "max-w-2xl",
	md: "max-w-3xl",
	lg: "max-w-4xl",
};

export default function StaticPageLayout({
	children,
	title,
	subtitle,
	maxWidth = "md",
	centered = false,
}: StaticPageLayoutProps) {
	if (centered) {
		return (
			<main className="flex flex-col items-center justify-center min-h-screen bg-bg0 text-center p-4">
				<h1 className="font-pixel text-primary text-lg pixel-text-shadow mb-4 uppercase">
					{title}
				</h1>
				<p className="text-sm font-pixel text-cream mb-6">{subtitle}</p>
				{children}
			</main>
		);
	}

	return (
		<div className="min-h-screen bg-bg0 p-4 md:p-8">
			<div className={`${maxWidthStyles[maxWidth]} mx-auto`}>
				<h1 className="font-pixel text-lg text-primary pixel-text-shadow mb-2 uppercase">
					{title}
				</h1>
				<p className="font-pixel text-[8px] text-cream-dim mb-8">{subtitle}</p>
				{children}
			</div>
		</div>
	);
}
