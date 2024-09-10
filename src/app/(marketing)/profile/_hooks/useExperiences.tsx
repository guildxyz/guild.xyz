import { Schemas } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"
import { useProfile } from "./useProfile"

export const useExperiences = <T extends boolean>({
  count,
  showOwnProfile,
}: { count?: T; showOwnProfile?: boolean }) => {
  const { data: profile } = useProfile(showOwnProfile)
  return useSWRImmutable<T extends true ? number : Schemas["Experience"][]>(
    profile
      ? [`/v2/profiles/${profile.username}/experiences`, count && `count=${count}`]
          .filter(Boolean)
          .join("?")
      : null
  )
}
