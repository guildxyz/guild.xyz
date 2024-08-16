import useSWRImmutable from "swr/immutable"
import { useProfile } from "./useProfile"

export const useReferredUsers = () => {
  const { data: profile } = useProfile()
  return useSWRImmutable(
    profile ? `/v2/profiles/${profile.username}/referred-users` : null
  )
}
