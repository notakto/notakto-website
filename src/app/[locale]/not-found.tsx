import Link from "next/link";
//TODO: Customize the 404 page design
export default function NotFound() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-black bg-[url('/background.png')] bg-no-repeat bg-cover bg-center text-center p-4">
			<p className="text-4xl text-red-600 mb-6">
				The page you’re looking for doesn’t exist.
			</p>
			<Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
				Go back home
			</Link>
		</main>
	);
}
