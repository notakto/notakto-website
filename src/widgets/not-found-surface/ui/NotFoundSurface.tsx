import NotFoundHomeLink from "@/widgets/not-found-home-link/ui/NotFoundHomeLink";
import NotFoundPageFrame from "@/widgets/not-found-page-frame/ui/NotFoundPageFrame";
import NotFoundSubtitle from "@/widgets/not-found-subtitle/ui/NotFoundSubtitle";
import NotFoundTitle from "@/widgets/not-found-title/ui/NotFoundTitle";

export default function NotFoundSurface() {
	return (
		<NotFoundPageFrame>
			<NotFoundTitle text="404" />
			<NotFoundSubtitle text="PAGE NOT FOUND" />
			<NotFoundHomeLink />
		</NotFoundPageFrame>
	);
}
