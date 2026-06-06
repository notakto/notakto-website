import HomeFooterDesktopHint from "@/widgets/home-footer-desktop-hint/ui/HomeFooterDesktopHint";
import HomeFooterMobileHint from "@/widgets/home-footer-mobile-hint/ui/HomeFooterMobileHint";

export default function HomeFooterHint() {
	return (
		<div className="mt-8 md:mt-12 font-pixel text-[7px] text-muted animate-pulse-pixel text-center">
			<HomeFooterDesktopHint />
			<HomeFooterMobileHint />
		</div>
	);
}
