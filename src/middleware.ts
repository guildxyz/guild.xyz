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

  if (guildUrlName === "base") {
    return NextResponse.redirect("/base-migration")
  }

  const _redirects = await get("redirects")

  const redirects = z
    .object({
      sameURL: z.array(z.string()),
      mapURL: z.array(z.tuple([z.string(), z.string()])),
    })
    .parse(_redirects)

  const sameRedirect = redirects.sameURL.find((urlName) => urlName === guildUrlName)

  if (sameRedirect) {
    return NextResponse.redirect(`https://era.guild.xyz/${request.nextUrl.pathname}`)
  }

  const mappedRedirect = redirects.mapURL.find(
    ([oldUrlName]) => oldUrlName === guildUrlName
  )

  if (mappedRedirect) {
    return NextResponse.redirect(`https://era.guild.xyz/${mappedRedirect[1]}`)
  }

  return NextResponse.next()
}
