import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/ddrum") {
    const url = new URL(request.url)
    const ddforward = url.searchParams.get("ddforward")

    if (!ddforward) return NextResponse.next()

    const redirectUrl = new URL(ddforward)
    return NextResponse.rewrite(redirectUrl)
  }

  const isGuildPage = request.nextUrl.pathname.split("/")?.length <= 2

  if (
    !isGuildPage ||
    request.nextUrl.pathname === request.nextUrl.pathname.toLowerCase()
  )
    return NextResponse.next()

  return NextResponse.redirect(
    new URL(request.nextUrl.origin + request.nextUrl.pathname.toLowerCase())
  )
}

export const config = {
  matcher: "/:path*",
}
