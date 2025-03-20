import { NextRequest } from "next/server"
import { neynarAPIClient } from "../neynarAPIClient"

export async function GET(request: NextRequest) {
  const fidString = request.nextUrl.searchParams.get("fid")

  if (!fidString)
    return Response.json(
      {
        error: "Missing param: fid",
      },
      {
        status: 400,
      }
    )

  const fid = Number(fidString)

  if (isNaN(fid))
    return Response.json(
      {
        error: "Invalid param: fid",
      },
      {
        status: 400,
      }
    )

  let usersChannels

  try {
    usersChannels = await neynarAPIClient.fetchUserChannels(fid)
  } catch {
    return Response.json(
      {
        error: "Farcaster API error",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "s-maxage=300", // 5 minutes
        },
      }
    )
  }
  const mappedUsersChannels = usersChannels.channels
    .filter((channel) => channel.moderator_fids?.includes(fid))
    .map((channel) => ({
      id: channel.id,
      name: channel.name ?? "Unknown channel",
      imageUrl: channel.image_url,
    }))

  return Response.json(mappedUsersChannels, {
    headers: {
      "Cache-Control": "s-maxage=3600", // 1 hour
    },
  })
}
