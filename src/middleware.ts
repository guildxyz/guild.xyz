/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(request: NextRequest) {
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
