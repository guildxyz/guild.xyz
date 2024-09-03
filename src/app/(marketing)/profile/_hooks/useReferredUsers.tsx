import { Schemas } from "@guildxyz/types"
import useSWRImmutable from "swr/immutable"
import { useProfile } from "./useProfile"

export const useReferredUsers = () => {
  const { data: profile } = useProfile()
  return useSWRImmutable<Schemas["Profile"][]>(
    profile ? `/v2/profiles/${profile.username}/referred-users` : null
  )
}
