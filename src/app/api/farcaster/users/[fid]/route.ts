export const dynamic = "force-dynamic"

import { neynarAPIClient } from "../../neynarAPIClient"
import { GetFarcasterUserByFIDResponse } from "../../types"

export async function GET(_: Request, { params }: { params: { fid: string } }) {
  if (!params.fid)
    return Response.json(
      {
        error: "Missing param: fid",
      },
      {
        status: 400,
      }
    )

  let user

  try {
    user = await neynarAPIClient
      .fetchBulkUsers([+params.fid])
      .then((res) => res.users[0])
  } catch {
    return Response.json(
      {
        error: "User not found",
      },
      {
        status: 404,
        headers: {
          "Cache-Control": "s-maxage=300", // 5 minutes
        },
      }
    )
  }

  const { fid, username, display_name, pfp_url, follower_count } = user

  return Response.json(
    {
      fid,
      username,
      display_name,
      pfp_url,
      follower_count,
    } satisfies GetFarcasterUserByFIDResponse,
    {
      headers: {
        "Cache-Control": "s-maxage=3600", // 1 hour
      },
    }
  )
}
