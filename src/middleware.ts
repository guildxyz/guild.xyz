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
  if (
    request.nextUrl.pathname === request.nextUrl.pathname.toLowerCase() ||
    request.nextUrl.pathname.startsWith("/lego") ||
    request.nextUrl.pathname.startsWith("/profile")
  ) {
    return NextResponse.next()
  }

  let transformedURL = request.url.split("?")[0].toLowerCase()

  if (request.nextUrl.search) {
    transformedURL += request.nextUrl.search
  }

  return NextResponse.redirect(transformedURL)
}
