import { type NextRequest } from "next/server"
import { LinkMetadata } from "./types"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return Response.json(
      { error: "Missing required query param: URL" } satisfies LinkMetadata,
      {
        status: 400,
      }
    )
  }

  const html = await fetch(url.toString()).then((res) => res.text())
  const [, , title] = new RegExp(/<title(.*)>(.*)<\/title>/gi).exec(html) ?? []

  if (!title) {
    return Response.json({ error: "Not found" } satisfies LinkMetadata, {
      status: 404,
    })
  }

  // Cache the response for 5 minutes
  return Response.json({ title } satisfies LinkMetadata, {
    headers: {
      "Cache-Control": "s-maxage=300",
    },
  })
}
