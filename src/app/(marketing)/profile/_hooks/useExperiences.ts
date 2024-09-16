import { Schemas } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"
import { useProfile } from "./useProfile"

export const useExperiences = <T extends boolean>({
  count,
  showOwnProfile,
  startTime,
}: { count: T; showOwnProfile?: boolean; startTime?: number }) => {
  const { data: profile } = useProfile(showOwnProfile)
  const params = new URLSearchParams(
    [
      ["count", count && count.toString()],
      ["startTime", startTime && startTime.toString()],
    ].filter(([_, value]) => value) as string[][]
  )
  return useSWRImmutable<T extends true ? number : Schemas["Experience"][]>(
    profile
      ? [
          `/v2/profiles/${profile.username}/experiences`,
          params.size && params.toString(),
        ]
          .filter(Boolean)
          .join("?")
      : null
  )
}
