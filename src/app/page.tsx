"use client";
import Menu from "@/app/Menu";
import { MenuLayout } from "@/components/ui/Containers/Menu/MenuLayout";
import { GameStateDashboard } from "@/jjj/GameStateDashboard";

export default function Home() {
	return (
		<GameStateDashboard>
			<MenuLayout>
				<Menu />
			</MenuLayout>
		</GameStateDashboard>
	);
}
