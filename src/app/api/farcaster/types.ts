import type { NeynarAPIClient } from "@neynar/nodejs-sdk"

type GetFarcasterUserByFIDResponse = Pick<
  Awaited<ReturnType<NeynarAPIClient["fetchBulkUsers"]>>["users"][number],
  "fid" | "username" | "display_name" | "pfp_url"
> & {
  follower_count: number // To make sure it's required
}

type SearchFarcasterUsersResponse = GetFarcasterUserByFIDResponse[]

type GetFarcasterRelevantFollowersResponse = Pick<
  NonNullable<
    Awaited<
      ReturnType<NeynarAPIClient["fetchRelevantFollowers"]>
    >["top_relevant_followers_hydrated"][number]["user"]
  >,
  "fid" | "username" | "display_name" | "pfp_url"
>[]

type GetFarcasterCastRawResponse = NonNullable<
  Awaited<ReturnType<NeynarAPIClient["lookUpCastByHashOrWarpcastUrl"]>>["cast"]
>
type GetFarcasterCastResponse = {
  hash: GetFarcasterCastRawResponse["hash"]
  timestamp: GetFarcasterCastRawResponse["timestamp"]
  author: {
    pfp_url: GetFarcasterCastRawResponse["author"]["pfp_url"]
    username: GetFarcasterCastRawResponse["author"]["username"]
    display_name?: GetFarcasterCastRawResponse["author"]["display_name"]
  }
  likes_count: GetFarcasterCastRawResponse["reactions"]["likes_count"]
  recasts_count: GetFarcasterCastRawResponse["reactions"]["recasts_count"]
  replies_count: GetFarcasterCastRawResponse["replies"]["count"]
}

type GetFarcasterChannelResponse = Pick<
  NonNullable<Awaited<ReturnType<NeynarAPIClient["lookupChannel"]>>>["channel"],
  "id" | "name" | "image_url"
>

type SearchFarcasterChannelsResponse = GetFarcasterChannelResponse[]

export type {
  GetFarcasterUserByFIDResponse,
  SearchFarcasterUsersResponse,
  GetFarcasterRelevantFollowersResponse,
  GetFarcasterCastResponse,
  GetFarcasterChannelResponse,
  SearchFarcasterChannelsResponse,
}
