import useSWRImmutable from "swr/immutable"
import { useProfile } from "./useProfile"

export const useExperiences = ({ count = false }: { count?: boolean }) => {
  const { data: profile } = useProfile()
  return useSWRImmutable(
    profile
      ? [`/v2/profiles/${profile.username}/experiences`, count && `count=${count}`]
          .filter(Boolean)
          .join("?")
      : null
  )
}
