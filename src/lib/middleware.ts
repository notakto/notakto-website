import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect only /api routes
  if (pathname.startsWith("/api")) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
      await adminAuth.verifyIdToken(idToken);
      // Authenticated, continue
      return NextResponse.next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

// Run only on API routes
export const config = {
  matcher: ["/api/:path*"],
};
