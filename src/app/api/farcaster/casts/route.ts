export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { neynarAPIClient } from "../neynarAPIClient"
import { GetFarcasterCastResponse } from "../types"

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type")

  if (type !== "hash" && type !== "url") {
    return Response.json(
      {
        error: "Invalid param: type",
      },
      {
        status: 400,
      }
    )
  }

  const identifier = request.nextUrl.searchParams.get("identifier")

  if (
    !identifier ||
    (!identifier.startsWith("http") && !identifier.startsWith("0x"))
  ) {
    return Response.json(
      {
        error: "Invalid param: identifier",
      },
      {
        status: 400,
      }
    )
  }

  let castResponse

  try {
    castResponse = await neynarAPIClient.lookUpCastByHashOrWarpcastUrl(
      identifier,
      type
    )
  } catch {
    return Response.json(
      {
        error: "Cast not found",
      },
      {
        status: 404,
        headers: {
          "Cache-Control": "s-maxage=300", // 5 minutes
        },
      }
    )
  }

  const {
    hash,
    timestamp,
    author: { pfp_url, username, display_name },
    reactions: { likes_count, recasts_count },
    replies: { count: replies_count },
  } = castResponse.cast

  return Response.json(
    {
      hash,
      timestamp,
      author: {
        pfp_url,
        username,
        display_name,
      },
      likes_count,
      recasts_count,
      replies_count,
    } satisfies GetFarcasterCastResponse,
    {
      headers: {
        "Cache-Control": "s-maxage=3600", // 1 hour
      },
    }
  )
}
