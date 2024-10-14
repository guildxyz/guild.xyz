import { neynarAPIClient } from "../../neynarAPIClient"

export const dynamic = "force-dynamic"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!params.id)
    return Response.json(
      {
        error: "Missing param: id",
      },
      {
        status: 400,
      }
    )

  let channel

  try {
    channel = await neynarAPIClient.lookupChannel(params.id)
  } catch {
    return Response.json(
      {
        error: "Channel not found",
      },
      {
        status: 404,
        headers: {
          "Cache-Control": "s-maxage=300", // 5 minutes
        },
      }
    )
  }

  const { id, name, image_url } = channel.channel

  return Response.json({ id, name, image_url })
}
