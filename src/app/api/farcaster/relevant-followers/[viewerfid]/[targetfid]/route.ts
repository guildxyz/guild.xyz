export const dynamic = "force-dynamic"

import { GetFarcasterRelevantFollowersResponse } from "@app/api/farcaster/types"
import { neynarAPIClient } from "../../../neynarAPIClient"

export async function GET(
  _: Request,
  { params }: { params: { viewerfid: string; targetfid: string } }
) {
  if (!params.viewerfid)
    return Response.json(
      {
        error: "Missing param: viewerfid",
      },
      {
        status: 400,
      }
    )

  if (!params.targetfid)
    return Response.json(
      {
        error: "Missing param: targetfid",
      },
      {
        status: 400,
      }
    )

  let relevantFollowers

  try {
    relevantFollowers = await neynarAPIClient.fetchRelevantFollowers(
      +params.targetfid,
      +params.viewerfid
    )
  } catch {
    return Response.json(
      {
        error: "Not found",
      },
      {
        status: 404,
        headers: {
          "Cache-Control": "s-maxage=300", // 5 minutes
        },
      }
    )
  }

  const mappedResponse = relevantFollowers.top_relevant_followers_hydrated
    .filter((relevantFollower) => !!relevantFollower.user)
    .map((relevantFollower) => {
      if (!relevantFollower.user)
        return null as unknown as GetFarcasterRelevantFollowersResponse
      return {
        fid: relevantFollower.user.fid,
        username: relevantFollower.user.username,
        display_name: relevantFollower.user.display_name,
        pfp_url: relevantFollower.user.pfp_url,
      }
    })
    .filter(Boolean) as GetFarcasterRelevantFollowersResponse

  return Response.json(mappedResponse, {
    headers: {
      "Cache-Control": "s-maxage=3600", // 1 hour
    },
  })
}
