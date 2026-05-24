import Link from "next/link";
import StaticPageLayout from "@/shared/ui/layout/StaticPageLayout";
import PixelButton from "@/shared/ui/pixel/PixelButton";

export default function NotFoundSurface() {
	return (
		<StaticPageLayout title="404" subtitle="PAGE NOT FOUND" centered>
			<Link href="/">
				<PixelButton variant="primary" size="sm">
					Go back home
				</PixelButton>
			</Link>
		</StaticPageLayout>
	);
}
