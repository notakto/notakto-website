import HomeMenuRuleLine from "@/widgets/home-menu-rule-line/ui/HomeMenuRuleLine";
import HomeMenuSubtitle from "@/widgets/home-menu-subtitle/ui/HomeMenuSubtitle";
import HomeMenuTitle from "@/widgets/home-menu-title/ui/HomeMenuTitle";

export default function HomeMenuTitleBlock() {
	return (
		<div className="text-center mb-8 md:mb-12 animate-drop">
			<HomeMenuTitle text="NOTAKTO" />
			<HomeMenuSubtitle text="NO TIES · ALWAYS A WINNER" />
			<HomeMenuRuleLine />
		</div>
	);
}
