import Link from "next/link";
import StaticPageLayout from "@/components/ui/Layout/StaticPageLayout";
import PixelButton from "@/components/ui/Pixel/PixelButton";

export default function NotFound() {
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
