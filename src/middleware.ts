import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Protect only /api routes (Logic from previous proxy.ts)
	if (pathname.startsWith("/api")) {
		const authHeader = req.headers.get("authorization");
		if (!authHeader?.startsWith("Bearer ")) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const idToken = authHeader.split("Bearer ")[1];
		const apiKey = process.env.FIREBASE_API_KEY;

		try {
			const res = await fetch(
				`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ idToken }),
				},
			);

			if (!res.ok) {
				return NextResponse.json({ error: "Invalid token" }, { status: 401 });
			}

			const data = await res.json();
			const user = data.users?.[0];
			if (!user) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}
			const requestHeaders = new Headers(req.headers);
			requestHeaders.set("x-user-uid", user.localId);

			return NextResponse.next({
				request: {
					headers: requestHeaders,
				},
			});
		} catch (error) {
			console.error("Token verification failed:", error);
			return NextResponse.json({ error: "Forbidden" }, { status: 420 });
		}
	}

	// For all other routes, use next-intl middleware
	return intlMiddleware(req);
}

export const config = {
	matcher: [
		// Match API routes
		"/api/:path*",
		// Match all pathnames except for
		// - … if they start with `/api`, `/_next` or `/_vercel`
		// - … the ones containing a dot (e.g. `favicon.ico`)
		"/((?!api|_next|_vercel|.*\\..*).*)",
		// Match string-literal paths for locales
		"/",
	],
};
