export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { neynarAPIClient } from "../../neynarAPIClient"
import { SearchFarcasterChannelsResponse } from "../../types"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")

  if (!q) {
    return Response.json(
      {
        error: "Invalid param: q",
      },
      {
        status: 400,
      }
    )
  }

  let channelsResponse

  try {
    channelsResponse = await neynarAPIClient.searchChannels(q, {
      limit: 10,
    })
  } catch {
    return Response.json(
      {
        error: "Couldn't find channels",
      },
      {
        status: 404,
        headers: {
          "Cache-Control": "s-maxage=300", // 5 minutes
        },
      }
    )
  }

  return Response.json(
    channelsResponse.channels.map(({ id, name, image_url }) => ({
      id,
      name,
      image_url,
    })) satisfies SearchFarcasterChannelsResponse,
    {
      headers: {
        "Cache-Control": "s-maxage=3600", // 1 hour
      },
    }
  )
}
