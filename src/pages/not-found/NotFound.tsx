import Link from "next/link";

import PixelButton from "@/components/ui/Pixel/PixelButton";
import StaticPageLayout from "@/shared/ui/layout/StaticPageLayout";

const NotFound = () => {
	return (
		<StaticPageLayout title="404" subtitle="PAGE NOT FOUND" centered>
			<Link href="/">
				<PixelButton variant="primary" size="sm">
					Go back home
				</PixelButton>
			</Link>
		</StaticPageLayout>
	);
};

export default NotFound;
