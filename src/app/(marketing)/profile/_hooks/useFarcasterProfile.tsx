import { useFarcasterAPI } from "@/hooks/useFarcasterAPI"
import { FarcasterProfile } from "@guildxyz/types"
import type { NeynarAPIClient } from "@neynar/nodejs-sdk"
import useUser from "components/[guild]/hooks/useUser"
import { KeyedMutator } from "swr"
import useSWRImmutable from "swr/immutable"

export type BulkUsersResponse = Awaited<
  ReturnType<NeynarAPIClient["fetchBulkUsers"]>
>
export type RelevantFollowersResponse = Awaited<
  ReturnType<NeynarAPIClient["fetchRelevantFollowers"]>
>

export type User = BulkUsersResponse["users"][number]

export const useFarcasterProfile = (guildUserId?: number) => {
  const linkedFcProfile = useSWRImmutable<FarcasterProfile[]>(
    guildUserId ? `/v2/users/${guildUserId}/farcaster-profiles` : null
  ).data?.at(0)

  // API reference: https://docs.neynar.com/reference/user-bulk
  const { data, mutate, ...rest } = useFarcasterAPI<BulkUsersResponse>(
    linkedFcProfile ? `/user/bulk?fids=${linkedFcProfile.fid}` : null
  )
  return {
    farcasterProfile: data?.users.at(0),
    mutate: mutate as unknown as KeyedMutator<BulkUsersResponse["users"][number]>,
    ...rest,
  }
}

export const useRelevantFarcasterFollowers = (farcasterId?: number) => {
  const currentUser = useUser()
  const currentUserFcProfile = currentUser.farcasterProfiles?.at(0)

  // API reference: https://docs.neynar.com/reference/relevant-followers
  const { data, mutate, ...rest } = useFarcasterAPI<RelevantFollowersResponse>(
    farcasterId && currentUserFcProfile
      ? `/followers/relevant?api_key=NEYNAR_API_DOCS&target_fid=${farcasterId}&viewer_fid=${currentUserFcProfile.fid}`
      : null
  )
  return {
    relevantFollowers: data?.top_relevant_followers_hydrated?.map(
      ({ user }) => user
    ),
    mutate: mutate as unknown as KeyedMutator<
      RelevantFollowersResponse["top_relevant_followers_hydrated"][number]["user"][]
    >,
    ...rest,
  }
}
