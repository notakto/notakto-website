import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rate_limiter: Record<string, number[]> = {};

export async function middleware(req: NextRequest) {
  console.log("Request headers:", req.headers);
  const { pathname } = req.nextUrl;

  // Protect only /api routes
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
      // ---- Rate limiting ----
      const now = Date.now();
      const windowMs = 10 * 1000; // 10 seconds
      const limit = 5; // max 5 requests per window

      if (!rate_limiter[user.localId]) {
        rate_limiter[user.localId] = [];
      }

      // remove old timestamps
      rate_limiter[user.localId] = rate_limiter[user.localId].filter(
        (ts) => now - ts < windowMs
      );

      if (rate_limiter[user.localId].length >= limit) {
        return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
      }

      rate_limiter[user.localId].push(now);
      // --------Add user ID to request headers ----
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
