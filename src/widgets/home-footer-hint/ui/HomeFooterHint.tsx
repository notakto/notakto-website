import HomeFooterDesktopHint from "@/widgets/home-footer-desktop-hint/ui/HomeFooterDesktopHint";
import HomeFooterMobileHint from "@/widgets/home-footer-mobile-hint/ui/HomeFooterMobileHint";

export default function HomeFooterHint() {
	return (
		<div className="mt-8 md:mt-12  text-[7px] text-gray-500 animate-pulse-pixel text-center">
			<HomeFooterDesktopHint />
			<HomeFooterMobileHint />
		</div>
	);
}
