import { NextApiHandler } from "next"
import { OneOf } from "types"

export type LinkMetadata = OneOf<
  {
    title: string
  },
  { error: string }
>

const handler: NextApiHandler<LinkMetadata> = async (request, response) => {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET, POST")
    response.status(405).json({ error: `Method ${request.method} is not allowed` })
    return
  }

  const { url } = request.query

  if (!url) {
    response.status(400).json({ error: "Missing required query param: URL" })
  }

  // @ts-expect-error TODO: fix this error originating from strictNullChecks
  const html = await fetch(url.toString()).then((res) => res.text())
  const [, , title] = new RegExp(/<title(.*)>(.*)<\/title>/gi).exec(html) ?? []

  if (!title) {
    response.status(404).json({ error: "Not found" })
    return
  }

  // Cache the response for 5 minutes
  response.setHeader("Cache-Control", "s-maxage=300")
  response.json({
    title,
  })
}

export default handler
