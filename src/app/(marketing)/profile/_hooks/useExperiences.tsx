import { Schemas } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"
import { useProfile } from "./useProfile"

export const useExperiences = <T extends boolean>({
  count,
  showOwnProfile,
  startTime,
}: { count: T; showOwnProfile?: boolean; startTime?: number }) => {
  const { data: profile } = useProfile(showOwnProfile)
  const oneMonthBeforeApprox = startTime && startTime - 86400 * 30
  const params = new URLSearchParams(
    [
      ["count", count && count.toString()],
      ["startTime", oneMonthBeforeApprox && oneMonthBeforeApprox.toString()],
    ].filter(([_, value]) => value) as string[][]
  )
  return useSWRImmutable<T extends true ? number : Schemas["Experience"][]>(
    profile
      ? `/v2/profiles/${profile.username}/experiences?${params.toString()}`
      : null
  )
}
