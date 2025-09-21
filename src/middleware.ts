import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("Request headers:", req.headers);
  const { pathname } = req.nextUrl;

  // Protect only /api routes
  if (pathname.startsWith("/api")) {
    const apiKey = process.env.FIREBASE_API_KEY;
    const isDev = process.env.NODE_ENV !== 'production' || !apiKey;

    // In development (or when missing API key), bypass auth to prevent local Invalid token errors
    if (isDev) {
      const requestHeaders = new Headers(req.headers);
      if (!requestHeaders.get('x-user-uid')) {
        requestHeaders.set('x-user-uid', 'dev-user');
      }
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
      const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
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

  return NextResponse.next();
}

// Run only on API routes
export const config = {
  matcher: ["/api/:path*"],
};
