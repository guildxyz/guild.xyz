import { FarcasterProfile } from "@guildxyz/types"
import useUser from "components/[guild]/hooks/useUser"
import useSWRImmutable from "swr/immutable"

export const useFarcasterProfile = (guildUserId?: number) => {
  const linkedFcProfile = useSWRImmutable<FarcasterProfile[]>(
    guildUserId ? `/v2/users/${guildUserId}/farcaster-profiles` : null
  ).data?.at(0)

  // API reference: https://docs.neynar.com/reference/user-bulk
  const { data, ...rest } = useSWRImmutable(
    linkedFcProfile
      ? `https://api.neynar.com/v2/farcaster/user/bulk?api_key=NEYNAR_API_DOCS&fids=${linkedFcProfile.fid}`
      : null
  )
  return { farcasterProfile: data?.users.at(0), ...rest }
}

export const useRelevantFarcasterFollowers = (farcasterId?: number) => {
  const currentUser = useUser()
  const currentUserFcProfile = currentUser.farcasterProfiles?.at(0)

  // API reference: https://docs.neynar.com/reference/relevant-followers
  const { data, ...rest } = useSWRImmutable(
    farcasterId && currentUserFcProfile
      ? `https://api.neynar.com/v2/farcaster/followers/relevant?api_key=NEYNAR_API_DOCS&target_fid=${farcasterId}&viewer_fid=${currentUserFcProfile.fid}`
      : null
  )
  return {
    relevantFollowers: data?.top_relevant_followers_hydrated?.map(
      ({ user }) => user
    ),
    ...rest,
  }
}
