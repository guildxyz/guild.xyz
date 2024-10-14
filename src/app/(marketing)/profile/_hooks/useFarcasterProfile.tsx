import {
  GetFarcasterRelevantFollowersResponse,
  GetFarcasterUserByFIDResponse,
} from "@app/api/farcaster/types"
import { FarcasterProfile } from "@guildxyz/types"
import useUser from "components/[guild]/hooks/useUser"
import useSWRImmutable from "swr/immutable"

export const useFarcasterProfile = (guildUserId?: number) => {
  const linkedFcProfile = useSWRImmutable<FarcasterProfile[]>(
    guildUserId ? `/v2/users/${guildUserId}/farcaster-profiles` : null
  ).data?.at(0)

  return useSWRImmutable<GetFarcasterUserByFIDResponse>(
    linkedFcProfile ? `/api/farcaster/users/${linkedFcProfile.fid}` : null
  )
}

export const useRelevantFarcasterFollowers = (farcasterId?: number) => {
  const currentUser = useUser()
  const currentUserFcProfile = currentUser.farcasterProfiles?.at(0)

  return useSWRImmutable<GetFarcasterRelevantFollowersResponse>(
    farcasterId && currentUserFcProfile
      ? `/api/farcaster/relevant-followers/${currentUserFcProfile.fid ?? 1}/${farcasterId}`
      : null
  )
}
