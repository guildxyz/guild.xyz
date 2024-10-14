export const dynamic = "force-dynamic"

import { NextRequest } from "next/server"
import { neynarAPIClient } from "../../neynarAPIClient"
import { SearchFarcasterUsersResponse } from "../../types"

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

  let usersResponse

  try {
    usersResponse = await neynarAPIClient.searchUser(q, undefined, {
      limit: 10,
    })
  } catch {
    return Response.json(
      {
        error: "Couldn't find users",
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
    usersResponse.result.users.map(
      ({ fid, username, display_name, pfp_url, follower_count }) => ({
        fid,
        username,
        display_name,
        pfp_url,
        follower_count,
      })
    ) satisfies SearchFarcasterUsersResponse,
    {
      headers: {
        "Cache-Control": "s-maxage=3600", // 1 hour
      },
    }
  )
}
