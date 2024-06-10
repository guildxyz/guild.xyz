import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export const config = {
  /**
   * The middleware won't run for:
   *
   * - `/api` paths
   * - `_next/...` paths
   * - Image/animation/video files
   */
  matcher: [
    "/((?!api(?:/.*)?|_next(?:/.*)?|.*\\.(?:jpg|jpeg|webp|webm|png|svg|ico|lottie)$).*)",
  ],
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === request.nextUrl.pathname.toLowerCase()) {
    return NextResponse.next()
  }

  return NextResponse.redirect(request.url.toLowerCase())
}
