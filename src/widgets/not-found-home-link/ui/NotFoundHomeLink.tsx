import Link from "next/link";
import NotFoundHomeButton from "@/widgets/not-found-home-button/ui/NotFoundHomeButton";

export default function NotFoundHomeLink() {
	return (
		<Link href="/">
			<NotFoundHomeButton />
		</Link>
	);
}
