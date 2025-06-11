import { get } from "@vercel/edge-config"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|lego|explorer|requirementLogos).*)",
  ],
}

export async function middleware(request: NextRequest) {
  const guildUrlName = request.nextUrl.pathname.split("/")[1]
  const redirects = await get("redirects")

  const redirectUrl =
    redirects &&
    typeof redirects === "object" &&
    !Array.isArray(redirects) &&
    guildUrlName in redirects
      ? redirects[guildUrlName]
      : undefined

  if (redirectUrl) {
    const parsedUrl = z.string().url().safeParse(redirectUrl)
    if (parsedUrl.success) {
      return NextResponse.redirect(parsedUrl.data)
    }
  }

  return NextResponse.next()
}
